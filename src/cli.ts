#!/usr/bin/env node

import { startMcpServer } from './server';
import { VideoService } from './services/video';

const args = process.argv.slice(2);

if (!process.env.YOUTUBE_API_KEY) {
    console.error('Error: YOUTUBE_API_KEY environment variable is required.');
    console.error('Please set it before running this server.');
    process.exit(1);
}

if (args.length > 0) {
    // 검색 CLI 모드
    const query = args.join(' ');
    const service = new VideoService();
    service.searchVideos({ query, maxResults: 3 }) // 최대 갯수는 임의로 설정하기, 입력 값으로 수정할수도 있지만 챗봇 특성상 갯수를 임의로 받으면 요청에 따라 부하가 너무 클 지도 모름
        .then(results => {
            console.log(JSON.stringify(results, null, 2)); // 출력 형식은 JSON 유지
            process.exit(0);
        })
        .catch(err => {
            console.error('Search failed:', err);
            process.exit(1);
        });
} else {
    // 서버 모드 (Spring AI MCP 연동 시 stdout으로 메시지 출력 금지)
    startMcpServer()
        .then(() => {
            // MCP 서버 시작 성공 로그는 출력하지 않음
        })
        .catch(error => {
            console.error('Failed to start YouTube MCP Server:', error);
            process.exit(1);
        });
}