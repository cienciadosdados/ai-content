"""
YouTube Transcript Extraction Service
Microservico Python usando youtube-transcript-api.
Extrai transcricoes diretamente - sem precisar de FFmpeg!
"""

import os
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
from youtube_transcript_api import YouTubeTranscriptApi
import requests

app = Flask(__name__)
CORS(app)

def extract_video_id(url):
    if 'youtube.com/watch?v=' in url:
        return url.split('v=')[1].split('&')[0]
    elif 'youtu.be/' in url:
        return url.split('youtu.be/')[1].split('?')[0]
    elif 'youtube.com/shorts/' in url:
        return url.split('shorts/')[1].split('?')[0]
    elif len(url) == 11:
        return url
    else:
        raise ValueError("URL do YouTube invalida")

def get_video_info(video_id):
    try:
        url = f"https://www.youtube.com/oembed?url=http://www.youtube.com/watch?v={video_id}&format=json"
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            data = response.json()
            return {
                'title': data.get('title', f'Video {video_id}'),
                'author': data.get('author_name', 'Desconhecido'),
            }
    except:
        pass
    return {
        'title': f'Video YouTube {video_id}',
        'author': 'Desconhecido',
    }

def get_transcript(video_id, target_language='pt'):
    try:
        # API v1.2.3 - tenta varios idiomas
        ytt_api = YouTubeTranscriptApi()
        
        # Tenta na ordem: idioma alvo, portugues, ingles, espanhol
        languages_to_try = [target_language, 'pt', 'en', 'es', 'pt-BR']
        
        transcript_data = None
        last_error = None
        
        for lang in languages_to_try:
            try:
                transcript_data = ytt_api.fetch(video_id, languages=[lang])
                break
            except Exception as e:
                last_error = e
                continue
        
        if not transcript_data:
            raise last_error or Exception("Nenhuma legenda encontrada")
        
        full_text = ""
        for entry in transcript_data:
            text = entry.text.replace('\n', ' ').strip()
            if text:
                full_text += text + " "
        
        return full_text.strip()
        
    except Exception as e:
        raise Exception(f"Erro ao obter transcricao: {str(e)}")

def estimate_duration(transcript):
    words = len(transcript.split())
    minutes = words / 150
    return int(minutes * 60)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

@app.route('/extract', methods=['POST'])
def extract():
    try:
        data = request.get_json()
        youtube_url = data.get('url', '')
        target_language = data.get('language', 'pt')
        
        if not youtube_url:
            return jsonify({'error': 'URL e obrigatoria'}), 400
        
        if 'youtube.com' not in youtube_url and 'youtu.be' not in youtube_url:
            return jsonify({'error': 'URL do YouTube invalida'}), 400
        
        video_id = extract_video_id(youtube_url)
        video_info = get_video_info(video_id)
        transcript = get_transcript(video_id, target_language)
        
        if not transcript:
            return jsonify({'error': 'Nao foi possivel obter a transcricao.'}), 400
        
        duration = estimate_duration(transcript)
        
        return jsonify({
            'success': True,
            'videoId': video_id,
            'title': video_info['title'],
            'author': video_info['author'],
            'transcript': transcript,
            'duration': duration,
            'characterCount': len(transcript),
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    print(f"Servidor iniciando na porta {port}...")
    app.run(host='0.0.0.0', port=port, debug=True)
