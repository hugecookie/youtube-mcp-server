#!/usr/bin/env node

import dotenv from 'dotenv';
dotenv.config();

import { VideoService } from './services/video';

if (!process.env.YOUTUBE_API_KEY) {
    console.error('Error: YOUTUBE_API_KEY environment variable is required.');
    process.exit(1);
}

const args = process.argv.slice(2);
const service = new VideoService();

if (args.length > 0) {
    // ✅ 인자 기반 CLI 검색
    const query = args.join(' ');
    service.searchVideos({ query, maxResults: 3 })
        .then(results => {
            console.log(JSON.stringify(results, null, 2));
            process.exit(0);
        })
        .catch(err => {
            console.error('Search failed:', err);
            process.exit(1);
        });

} else {
    // ✅ stdin 입력으로 검색
    let input = '';
    process.stdin.on('data', chunk => {
        input += chunk;
    });

    process.stdin.on('end', () => {
        try {
            const request = JSON.parse(input);
            const query = request.text || '';
            service.searchVideos({ query, maxResults: 3 })
                .then(results => {
                    process.stdout.write(JSON.stringify(results, null, 2) + "\n");
                })
                .catch(err => {
                    console.error('Search failed:', err);
                    process.exit(1);
                });
        } catch (e) {
            console.error('Invalid JSON input:', e);
            process.exit(1);
        }
    });

    process.stdin.resume();
}