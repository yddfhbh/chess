// ============================================================
//  ♟️ 체스 게임 엔진 (순수 JavaScript) - SVG 기물 + AI 모드
// ============================================================

// ── SVG 기물 이미지 (인라인) ──
var PIECE_SVG = {
    K: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22.5 11.63V6M20 8h5" stroke-linejoin="miter"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#fff" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10V37z" fill="#fff"/><path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0"/></g></svg>',
    Q: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="#fff" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm16.5-4.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm-16 0a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm32 0a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm-16 0a2 2 0 1 1-4 0 2 2 0 1 1 4 0z"/><path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15L14 11v14L7 14l2 12z" stroke-linecap="butt"/><path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" stroke-linecap="butt"/><path d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0" fill="none"/></g></svg>',
    R: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="#fff" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 39h27v-3H9v3zm3-3v-4h21v4H12zm-1-22V9h4v2h5V9h5v2h5V9h4v5" stroke-linecap="butt"/><path d="M34 14l-3 3H14l-3-3"/><path d="M15 17v7h15v-7" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M14 29.5v-13h17v13H14z" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M14 16.5L11 14h23l-3 2.5H14zM11 14V9h4v2h5V9h5v2h5V9h4v5H11z" stroke-linecap="butt"/><path d="M12 35.5h21m-20-4h19m-18-2h17" fill="none" stroke-linejoin="miter"/></g></svg>',
    B: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><g fill="#fff" stroke-linecap="butt"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/></g><path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" stroke-linejoin="miter"/></g></svg>',
    N: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#fff"/><path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill="#fff"/><path d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0zm5.433-9.75a.5 1.5 30 1 1-.866-.5.5 1.5 30 1 1 .866.5z" fill="#000"/></g></svg>',
    P: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03C15.41 27.09 11 31.58 11 39.5H34c0-7.92-4.41-12.41-7.41-13.47C28.06 24.84 29 23.03 29 21c0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#fff" stroke="#000" stroke-width="1.5" stroke-linecap="round"/></svg>',
    k: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22.5 11.63V6" stroke-linejoin="miter"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#000" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10V37z" fill="#000"/><path d="M20 8h5" stroke-linejoin="miter"/><path d="M32 29.5s8.5-4 6.03-9.65C34.15 14 25 18 22.5 24.5l.01 2.1-.01-2.1C20 18 9.906 14 6.997 19.85c-2.497 5.65 4.853 9 4.853 9" stroke="#fff"/><path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" stroke="#fff"/></g></svg>',
    q: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><g fill="#000" stroke="none"><circle cx="6" cy="12" r="2.75"/><circle cx="14" cy="9" r="2.75"/><circle cx="22.5" cy="8" r="2.75"/><circle cx="31" cy="9" r="2.75"/><circle cx="39" cy="12" r="2.75"/></g><path d="M9 26c8.5-1.5 21-1.5 27 0l2.5-12.5L31 25l-.3-14.1-5.2 13.6-3-14.5-3 14.5-5.2-13.6L14 25 6.5 13.5 9 26z" fill="#000" stroke-linecap="butt"/><path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" fill="#000" stroke-linecap="butt"/><path d="M11 38.5a35 35 1 0 0 23 0" fill="none" stroke-linecap="butt"/><path d="M11 29a35 35 1 0 1 23 0" fill="none" stroke="#fff"/><path d="M12.5 31.5h20" fill="none" stroke="#fff"/><path d="M11.5 34.5a35 35 1 0 0 22 0" fill="none" stroke="#fff"/><path d="M10.5 37.5a35 35 1 0 0 24 0" fill="none" stroke="#fff"/></g></svg>',
    r: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 39h27v-3H9v3zm3.5-7l1.5-2.5h17l1.5 2.5h-20zm-.5 4v-4h21v4H12z" stroke-linecap="butt" fill="#000"/><path d="M14 29.5v-13h17v13H14z" stroke-linecap="butt" stroke-linejoin="miter" fill="#000"/><path d="M14 16.5L11 14h23l-3 2.5H14zM11 14V9h4v2h5V9h5v2h5V9h4v5H11z" stroke-linecap="butt" fill="#000"/><path d="M12 35.5h21m-20-4h19m-18-2h17" fill="none" stroke="#fff" stroke-width="1" stroke-linejoin="miter"/></g></svg>',
    b: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><g fill="#000" stroke-linecap="butt"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/></g><path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" stroke="#fff" stroke-linejoin="miter"/></g></svg>',
    n: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#000"/><path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill="#000"/><path d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0zm5.433-9.75a.5 1.5 30 1 1-.866-.5.5 1.5 30 1 1 .866.5z" fill="#fff" stroke="#fff"/></g></svg>',
    p: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03C15.41 27.09 11 31.58 11 39.5H34c0-7.92-4.41-12.41-7.41-13.47C28.06 24.84 29 23.03 29 21c0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#000" stroke="#000" stroke-width="1.5" stroke-linecap="round"/></svg>'
};

var INITIAL_BOARD = [
    ['r','n','b','q','k','b','n','r'],
    ['p','p','p','p','p','p','p','p'],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['P','P','P','P','P','P','P','P'],
    ['R','N','B','Q','K','B','N','R']
];

var gameSetting = {
    mode: 'pvp', minutes: 5, increment: 0,
    whiteName: '백 (White)', blackName: '흑 (Black)', unlimited: false,
    aiColor: 'black',       // ★ AI가 맡는 색상
    aiLevel: 10,            // ★ AI 난이도 (Stockfish Skill Level 0~20)
    playerColor: 'white'    // ★ 플레이어가 맡는 색상
};

var AI_LEVEL_MIN = 1;
var AI_LEVEL_MAX = 20;

var board = [];
var currentTurn = 'white';
var selectedSquare = null;
var possibleMoves = [];
var moveHistory = [];
var boardHistory = [];
var castlingRights = { K: true, Q: true, k: true, q: true };
var enPassantTarget = null;
var halfMoveClock = 0;
var fullMoveNumber = 1;
var whiteTime = 600;
var blackTime = 600;
var timerInterval = null;
var gameOver = false;
var isFlipped = false;
var capturedByWhite = [];
var capturedByBlack = [];
var lastMoveFrom = null;
var lastMoveTo = null;
var firstMoveMade = false;
var dragState = null;
var turnStartedAt = null;
var gameStartedAt = null;
var finalGameResult = '*';
var finalGameTermination = '';
var gameEndedAt = null;
var selectedInteractionMode = null;
var selectedPiece = null;
var premoveQueue = [];
var resignModalPending = false;
var drawOfferBy = null;
var suppressBoardClickUntil = 0;
var dragGhostEl = null;

// ★ ============================================================
//  Stockfish WASM 엔진 관련 변수
// ★ ============================================================
var stockfishWorker = null;
var engineReady = false;
var aiThinking = false;

var FIREBASE_CONFIG = {
    apiKey: "AIzaSyCQfoxyy3clAsRTN37Pw8_bvXNAgRXByhk",
    authDomain: "chess-6f000.firebaseapp.com",
    databaseURL: "https://chess-6f000-default-rtdb.firebaseio.com",
    projectId: "chess-6f000",
    storageBucket: "chess-6f000.firebasestorage.app",
    messagingSenderId: "413376873387",
    appId: "1:413376873387:web:b69e4bd2a2c1fd29e3c8ee",
    measurementId: "G-RN7CHDW6JJ"
};

var firebaseApp = null;
var firebaseAuth = null;
var firebaseDb = null;
var ONLINE_CLIENT_ID_STORAGE_KEY = 'chess-online-client-id';

function generateOnlineClientId() {
    return 'client-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
}

function getOnlineClientId() {
    try {
        var existing = window.sessionStorage ? sessionStorage.getItem(ONLINE_CLIENT_ID_STORAGE_KEY) : '';
        if (existing) return existing;
        var created = generateOnlineClientId();
        if (window.sessionStorage) sessionStorage.setItem(ONLINE_CLIENT_ID_STORAGE_KEY, created);
        return created;
    } catch (err) {
        return generateOnlineClientId();
    }
}

function setOnlineClientId(clientId) {
    onlineState.clientId = clientId;
    try {
        if (window.sessionStorage) sessionStorage.setItem(ONLINE_CLIENT_ID_STORAGE_KEY, clientId);
    } catch (err) {}
    return clientId;
}

function refreshOnlineClientId() {
    return setOnlineClientId(generateOnlineClientId());
}

var onlineState = {
    enabled: false,
    authReady: false,
    authUid: null,
    clientId: getOnlineClientId(),
    roomId: null,
    roomRef: null,
    roomListener: null,
    roomData: null,
    roomStarted: false,
    playerColor: null,
    inQueue: false,
    queueRef: null,
    assignmentRef: null,
    assignmentListener: null,
    presenceRef: null,
    presenceDisconnect: null,
    presenceField: null,
    gameRevision: -1,
    applyingRemoteState: false,
    syncingState: false,
    lastSyncedStateHash: null,
    claimingDisconnectWin: false,
    showJoinRoomInput: false
};

// ★ Stockfish 엔진 초기화
function initEngine() {
    return new Promise(function(resolve, reject) {
        try {
            stockfishWorker = new Worker('stockfish-18-lite-single.js');
            
            stockfishWorker.onmessage = function(e) {
                var line = e.data;
                // console.log('SF:', line); // 디버그용
                
                if (line === 'uciok') {
                    engineReady = true;
                    // Skill Level 설정
                    stockfishWorker.postMessage('setoption name Skill Level value ' + gameSetting.aiLevel);
                    stockfishWorker.postMessage('isready');
                }
                
                if (line === 'readyok') {
                    resolve();
                }
                
                // bestmove 파싱
                if (typeof line === 'string' && line.indexOf('bestmove') === 0) {
                    var parts = line.split(' ');
                    var bestMove = parts[1];
                    if (bestMove && bestMove !== '(none)') {
                        handleEngineMove(bestMove);
                    }
                }
            };
            
            stockfishWorker.onerror = function(err) {
                console.error('Stockfish Worker Error:', err);
                reject(err);
            };
            
            // UCI 프로토콜 시작
            stockfishWorker.postMessage('uci');
            
        } catch (err) {
            console.error('엔진 초기화 실패:', err);
            reject(err);
        }
    });
}

// ★ 현재 보드 상태를 FEN 문자열로 변환
function boardToFEN() {
    var fen = '';
    for (var r = 0; r < 8; r++) {
        var empty = 0;
        for (var c = 0; c < 8; c++) {
            var piece = board[r][c];
            if (piece === '') {
                empty++;
            } else {
                if (empty > 0) { fen += empty; empty = 0; }
                fen += piece;
            }
        }
        if (empty > 0) fen += empty;
        if (r < 7) fen += '/';
    }
    
    // 턴
    fen += ' ' + (currentTurn === 'white' ? 'w' : 'b');
    
    // 캐슬링
    var castleStr = '';
    if (castlingRights.K) castleStr += 'K';
    if (castlingRights.Q) castleStr += 'Q';
    if (castlingRights.k) castleStr += 'k';
    if (castlingRights.q) castleStr += 'q';
    fen += ' ' + (castleStr || '-');
    
    // 앙파상
    if (enPassantTarget) {
        var files = 'abcdefgh';
        var ranks = '87654321';
        fen += ' ' + files[enPassantTarget[1]] + ranks[enPassantTarget[0]];
    } else {
        fen += ' -';
    }
    
    // 하프무브 클럭 & 풀무브 넘버
    fen += ' ' + halfMoveClock;
    fen += ' ' + fullMoveNumber;
    
    return fen;
}

// ★ AI에게 수를 요청
function requestAIMove() {
    if (!stockfishWorker || !engineReady || gameOver || aiThinking) return;
    
    aiThinking = true;
    showAIThinking(true);
    
    var fen = boardToFEN();
    
    // 새 게임 시작 시 position 설정
    stockfishWorker.postMessage('position fen ' + fen);
    
    // 난이도에 따른 탐색 깊이/시간 조절
    var depth;
    if (gameSetting.aiLevel <= 1) depth = 1;
    else if (gameSetting.aiLevel <= 3) depth = 4;
    else if (gameSetting.aiLevel <= 5) depth = 8;
    else if (gameSetting.aiLevel <= 10) depth = 12;
    else depth = 18;
    
    stockfishWorker.postMessage('go depth ' + depth);
}

// ★ 엔진이 반환한 수를 처리
function handleEngineMove(moveStr) {
    aiThinking = false;
    showAIThinking(false);
    
    if (gameOver) return;
    
    // moveStr 형식: "e2e4", "e7e8q" (프로모션)
    var files = 'abcdefgh';
    var ranks = '87654321';
    
    var fromCol = files.indexOf(moveStr[0]);
    var fromRow = ranks.indexOf(moveStr[1]);
    var toCol = files.indexOf(moveStr[2]);
    var toRow = ranks.indexOf(moveStr[3]);
    
    var promotionPiece = null;
    if (moveStr.length === 5) {
        var promChar = moveStr[4];
        // AI 색상에 맞게 대소문자 결정
        if (currentTurn === 'white') {
            promotionPiece = promChar.toUpperCase();
        } else {
            promotionPiece = promChar.toLowerCase();
        }
    }
    
    if (fromRow < 0 || fromCol < 0 || toRow < 0 || toCol < 0) {
        console.error('잘못된 엔진 수:', moveStr);
        return;
    }
    
    executeMove(fromRow, fromCol, toRow, toCol, promotionPiece);
}

// ★ AI 생각 중 표시
function showAIThinking(show) {
    var el = document.getElementById('ai-thinking');
    if (show) el.classList.add('visible');
    else el.classList.remove('visible');
}

// ★ AI 턴인지 확인
function isAITurn() {
    return gameSetting.mode === 'ai' && currentTurn === gameSetting.aiColor && !gameOver;
}

function isOnlineMode() {
    return gameSetting.mode === 'online';
}

function getOnlinePlayerColor() {
    return onlineState.playerColor;
}

function isLocalOnlineTurn() {
    return isOnlineMode() && !gameOver && !!onlineState.playerColor && currentTurn === onlineState.playerColor;
}

function normalizeRoomCode(code) {
    return String(code || '').replace(/[^a-z0-9]/gi, '').toUpperCase();
}

function generateRoomCode() {
    var alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var code = '';
    for (var i = 0; i < 6; i++) {
        code += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return code;
}

function getOnlineNickname() {
    var input = document.getElementById('online-name');
    var value = input && input.value ? input.value.trim() : '';
    return value;
}

function requireOnlineNickname() {
    var nickname = getOnlineNickname();
    if (!nickname) throw new Error('닉네임을 입력해주세요.');
    return nickname;
}

function getSelectedTimeSettings() {
    return {
        minutes: gameSetting.minutes,
        increment: gameSetting.increment,
        unlimited: gameSetting.unlimited
    };
}

function getMatchmakingKey() {
    var settings = getSelectedTimeSettings();
    if (settings.unlimited) return 'unlimited';
    return String(settings.minutes) + '_' + String(settings.increment);
}

function setLobbyOnlineMessage(text) {
    var el = document.getElementById('online-status-text');
    if (el) el.textContent = text;
}

function setLobbyOnlinePill(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
}

function syncDisplayedPlayerNames() {
    var whiteNameEl = document.getElementById('display-white-name');
    var blackNameEl = document.getElementById('display-black-name');
    if (whiteNameEl) whiteNameEl.textContent = gameSetting.whiteName || '백';
    if (blackNameEl) blackNameEl.textContent = gameSetting.blackName || '흑';
}

function isOwnedInviteRoomWaiting() {
    return !!(
        onlineState.roomId &&
        onlineState.roomData &&
        onlineState.roomData.type === 'invite' &&
        onlineState.roomData.status === 'waiting' &&
        onlineState.roomData.hostUid === onlineState.clientId
    );
}

function updateOnlineUI() {
    var nickname = getOnlineNickname();
    var authText = nickname ? ('닉네임: ' + nickname) : '닉네임을 입력하세요';
    setLobbyOnlinePill('online-auth-status', authText);

    var connectionText = onlineState.authReady ? '온라인 준비 완료' : 'Firebase 연결 중...';
    if (onlineState.roomId && onlineState.roomData && onlineState.roomData.status === 'waiting') connectionText = '방 대기 중';
    else if (onlineState.roomId && onlineState.roomData && onlineState.roomData.status === 'playing') connectionText = '온라인 대국 중';
    else if (onlineState.inQueue) connectionText = '랜덤 매칭 대기 중';
    setLobbyOnlinePill('online-connection-status', connectionText);

    var roomBox = document.getElementById('online-room-box');
    var roomCode = document.getElementById('online-room-code');
    var joinRow = document.getElementById('online-join-row');
    var copyBtn = document.getElementById('copy-room-btn');
    var joinToggleBtn = document.getElementById('join-room-toggle-btn');
    var createBtn = document.getElementById('create-room-btn');
    var randomBtn = document.getElementById('random-match-btn');
    var joinBtn = document.getElementById('join-room-btn');
    var canStartOnline = onlineState.authReady && !!nickname;
    var hasActiveGame = !!(onlineState.roomData && onlineState.roomData.status === 'playing');
    var hasOwnedInviteWaiting = isOwnedInviteRoomWaiting();
    var showInviteRoomInfo = !!(
        onlineState.roomId &&
        onlineState.roomData &&
        onlineState.roomData.type === 'invite'
    );
    if (joinRow) joinRow.style.display = (onlineState.showJoinRoomInput && !hasActiveGame) ? 'grid' : 'none';
    if (roomBox) roomBox.style.display = showInviteRoomInfo ? 'block' : 'none';
    if (roomCode) roomCode.textContent = onlineState.roomId || '------';
    if (copyBtn) copyBtn.style.display = showInviteRoomInfo ? 'inline-block' : 'none';

    if (createBtn) {
        createBtn.disabled = (!canStartOnline && !hasOwnedInviteWaiting) || hasActiveGame;
        createBtn.textContent = hasOwnedInviteWaiting ? '방 삭제하기' : '방 만들기';
        createBtn.classList.toggle('primary', !hasOwnedInviteWaiting);
        createBtn.classList.toggle('danger', hasOwnedInviteWaiting);
    }
    if (joinToggleBtn) {
        joinToggleBtn.disabled = !canStartOnline || hasActiveGame;
        joinToggleBtn.classList.toggle('active', !!onlineState.showJoinRoomInput && !hasActiveGame);
    }
    if (joinBtn) joinBtn.disabled = !canStartOnline;
    if (randomBtn) {
        randomBtn.disabled = (!canStartOnline && !onlineState.inQueue) || hasActiveGame;
        randomBtn.textContent = onlineState.inQueue ? '매칭 취소' : '랜덤 매칭';
        randomBtn.classList.toggle('danger', !!onlineState.inQueue);
    }

    var startBtn = document.getElementById('start-game-btn');
    if (startBtn) startBtn.style.display = isOnlineMode() ? 'none' : 'block';

    var localPlayerSection = document.getElementById('local-player-section');
    if (localPlayerSection) localPlayerSection.style.display = isOnlineMode() ? 'none' : 'block';
}

function ensureFirebaseReady() {
    if (onlineState.authReady && firebaseDb && firebaseAuth) return Promise.resolve();
    if (!window.firebase) {
        setLobbyOnlineMessage('Firebase SDK를 불러오지 못했습니다.');
        return Promise.reject(new Error('Firebase SDK unavailable'));
    }
    if (!firebaseApp) {
        firebaseApp = firebase.apps.length ? firebase.app() : firebase.initializeApp(FIREBASE_CONFIG);
        firebaseAuth = firebase.auth();
        firebaseDb = firebase.database();
    }
    if (firebaseAuth.currentUser) {
        onlineState.authReady = true;
        onlineState.authUid = firebaseAuth.currentUser.uid;
        updateOnlineUI();
        return Promise.resolve();
    }
    return firebaseAuth.signInAnonymously().then(function() {
        onlineState.authReady = true;
        onlineState.authUid = firebaseAuth.currentUser.uid;
        updateOnlineUI();
    }).catch(function(err) {
        setLobbyOnlineMessage('Firebase 연결 실패: ' + err.message);
        throw err;
    });
}

function buildInitialOnlineGameState() {
    var settings = getSelectedTimeSettings();
    var initialSeconds = settings.unlimited ? 0 : settings.minutes * 60;
    return {
        state: {
            board: cloneBoard(INITIAL_BOARD),
            currentTurn: 'white',
            drawOfferBy: null,
            castlingRights: { K: true, Q: true, k: true, q: true },
            enPassantTarget: null,
            halfMoveClock: 0,
            fullMoveNumber: 1,
            capturedByWhite: [],
            capturedByBlack: [],
            lastMoveFrom: null,
            lastMoveTo: null,
            whiteTime: initialSeconds,
            blackTime: initialSeconds,
            firstMoveMade: false
        },
        moveHistory: [],
        finalGameResult: '*',
        finalGameTermination: '',
        gameStartedAt: Date.now(),
        gameEndedAt: null
    };
}

function toIndexedArray(value) {
    if (Array.isArray(value)) return value.slice();
    if (!value || typeof value !== 'object') return [];
    var arr = [];
    Object.keys(value).forEach(function(key) {
        var index = Number(key);
        if (!Number.isInteger(index) || index < 0) return;
        arr[index] = value[key];
    });
    return arr;
}

function normalizePieceList(value) {
    return toIndexedArray(value).map(function(piece) {
        return typeof piece === 'string' ? piece : '';
    }).filter(function(piece) {
        return !!piece;
    });
}

function normalizeCoordinatePair(value) {
    var pair = toIndexedArray(value);
    if (pair.length < 2) return null;
    if (typeof pair[0] !== 'number' || typeof pair[1] !== 'number') return null;
    return [pair[0], pair[1]];
}

function normalizeBoard(value) {
    var rows = toIndexedArray(value);
    var normalized = [];
    for (var r = 0; r < 8; r++) {
        var cells = toIndexedArray(rows[r]);
        var row = [];
        for (var c = 0; c < 8; c++) {
            row[c] = typeof cells[c] === 'string' ? cells[c] : '';
        }
        normalized[r] = row;
    }
    return normalized;
}

function normalizeSerializedOnlineGameState(serializedState) {
    var fallback = buildInitialOnlineGameState();
    var source = serializedState && typeof serializedState === 'object' ? serializedState : fallback;
    var rawState = source.state && typeof source.state === 'object' ? source.state : fallback.state;
    var boardSource = rawState.board == null ? fallback.state.board : rawState.board;
    var initialSeconds = gameSetting.unlimited ? 0 : gameSetting.minutes * 60;
    return {
        state: {
            board: normalizeBoard(boardSource),
            currentTurn: rawState.currentTurn === 'black' ? 'black' : 'white',
            drawOfferBy: rawState.drawOfferBy === 'black' ? 'black' : (rawState.drawOfferBy === 'white' ? 'white' : null),
            castlingRights: {
                K: rawState.castlingRights ? rawState.castlingRights.K !== false : true,
                Q: rawState.castlingRights ? rawState.castlingRights.Q !== false : true,
                k: rawState.castlingRights ? rawState.castlingRights.k !== false : true,
                q: rawState.castlingRights ? rawState.castlingRights.q !== false : true
            },
            enPassantTarget: normalizeCoordinatePair(rawState.enPassantTarget),
            halfMoveClock: typeof rawState.halfMoveClock === 'number' ? rawState.halfMoveClock : 0,
            fullMoveNumber: typeof rawState.fullMoveNumber === 'number' ? rawState.fullMoveNumber : 1,
            capturedByWhite: normalizePieceList(rawState.capturedByWhite),
            capturedByBlack: normalizePieceList(rawState.capturedByBlack),
            lastMoveFrom: normalizeCoordinatePair(rawState.lastMoveFrom),
            lastMoveTo: normalizeCoordinatePair(rawState.lastMoveTo),
            whiteTime: typeof rawState.whiteTime === 'number' ? rawState.whiteTime : initialSeconds,
            blackTime: typeof rawState.blackTime === 'number' ? rawState.blackTime : initialSeconds,
            firstMoveMade: !!rawState.firstMoveMade
        },
        moveHistory: toIndexedArray(source.moveHistory).filter(function(move) {
            return !!move && typeof move === 'object';
        }),
        finalGameResult: typeof source.finalGameResult === 'string' ? source.finalGameResult : '*',
        finalGameTermination: typeof source.finalGameTermination === 'string' ? source.finalGameTermination : '',
        gameStartedAt: source.gameStartedAt || fallback.gameStartedAt,
        gameEndedAt: source.gameEndedAt || null
    };
}

function serializeCurrentGameState() {
    return {
        state: cloneState(),
        moveHistory: moveHistory.map(function(move) {
            return {
                notation: move.notation,
                color: move.color,
                durationMs: move.durationMs,
                clockAfterMove: move.clockAfterMove
            };
        }),
        finalGameResult: finalGameResult,
        finalGameTermination: finalGameTermination,
        gameStartedAt: gameStartedAt ? gameStartedAt.getTime() : Date.now(),
        gameEndedAt: gameEndedAt ? gameEndedAt.getTime() : null
    };
}

function rebuildMoveListFromHistory() {
    var moveList = document.getElementById('move-list');
    if (!moveList) return;
    moveList.innerHTML = '';
    for (var i = 0; i < moveHistory.length; i++) {
        var move = moveHistory[i];
        if (move.color === 'white') {
            var entry = document.createElement('div');
            entry.className = 'move-entry';
            entry.innerHTML = '<span class="move-number">' + (Math.floor(i / 2) + 1) + '.</span><span class="move-white">' + createMoveCellHtml(move.notation, move.durationMs) + '</span><span class="move-black"></span>';
            moveList.appendChild(entry);
        } else {
            var entries = moveList.querySelectorAll('.move-entry');
            var last = entries[entries.length - 1];
            if (last) last.querySelector('.move-black').innerHTML = createMoveCellHtml(move.notation, move.durationMs);
        }
    }
    moveList.scrollTop = moveList.scrollHeight;
}

function getOnlineGameOverTitle() {
    return getGameOverDisplayInfo().title;
}

function getOnlineGameOverMessage() {
    return getGameOverDisplayInfo().message;
}

function getWinnerColorFromResult(result) {
    if (result === '1-0') return 'white';
    if (result === '0-1') return 'black';
    return null;
}

function getViewerColorForResult() {
    if (isOnlineMode()) return onlineState.playerColor;
    if (gameSetting.mode === 'ai') return gameSetting.playerColor;
    return null;
}

function getDefaultGameOverTitle() {
    if (finalGameTermination === '체크메이트') return '체크메이트! 🏆';
    if (finalGameTermination === '스테일메이트') return '스테일메이트!';
    if (finalGameTermination === '기물 부족') return '기물 부족!';
    if (finalGameTermination === '50수 규칙') return '50수 규칙!';
    if (finalGameTermination === '시간 초과') return '시간 초과! ⏰';
    if (finalGameTermination === '기권') return '기권';
    if (finalGameResult === '1/2-1/2') return '무승부';
    return '게임 종료';
}

function getPerspectiveGameOverMessage(outcome, reasonText) {
    if (outcome === 'win') {
        if (reasonText === '기권') return '상대가 기권하여 승리했습니다!';
        if (reasonText === '시간 초과') return '상대의 시간 초과로 승리했습니다!';
        if (reasonText === '체크메이트') return '체크메이트로 승리했습니다!';
        return '승리했습니다!';
    }
    if (outcome === 'lose') {
        if (reasonText === '기권') return '기권하여 패배했습니다.';
        if (reasonText === '시간 초과') return '시간 초과로 패배했습니다.';
        if (reasonText === '체크메이트') return '체크메이트로 패배했습니다.';
        return '패배했습니다.';
    }
    return '';
}

function getGameOverDisplayInfo() {
    var title = getDefaultGameOverTitle();

    if (finalGameResult === '1/2-1/2') {
        return { title: title, message: '무승부입니다.' };
    }

    var winnerColor = getWinnerColorFromResult(finalGameResult);
    if (!winnerColor) {
        return { title: title, message: finalGameTermination || '게임이 종료되었습니다.' };
    }

    var viewerColor = getViewerColorForResult();
    if (viewerColor === 'white' || viewerColor === 'black') {
        var outcome = viewerColor === winnerColor ? 'win' : 'lose';
        return {
            title: outcome === 'win' ? '승리!' : '패배',
            message: getPerspectiveGameOverMessage(outcome, finalGameTermination)
        };
    }

    return {
        title: title,
        message: getWinnerNameByColor(winnerColor) + '의 승리입니다!'
    };
}

function showResolvedGameOver() {
    var display = getGameOverDisplayInfo();
    showGameOver(display.title, display.message);
}

function getOnlinePresenceField(color) {
    if (color === 'white') return 'whiteConnected';
    if (color === 'black') return 'blackConnected';
    return null;
}

function clearOnlinePresence() {
    if (onlineState.presenceDisconnect && onlineState.presenceDisconnect.cancel) {
        onlineState.presenceDisconnect.cancel().catch(function() {});
    }
    onlineState.presenceRef = null;
    onlineState.presenceDisconnect = null;
    onlineState.presenceField = null;
}

function updateOnlinePresence(room) {
    if (!firebaseDb || !onlineState.roomId || !onlineState.playerColor || !room || room.status !== 'playing') {
        clearOnlinePresence();
        return;
    }
    var field = getOnlinePresenceField(onlineState.playerColor);
    if (!field) return;
    if (!onlineState.presenceRef || onlineState.presenceField !== field) {
        clearOnlinePresence();
        onlineState.presenceField = field;
        onlineState.presenceRef = firebaseDb.ref('rooms/' + onlineState.roomId + '/' + field);
        onlineState.presenceDisconnect = onlineState.presenceRef.onDisconnect();
        onlineState.presenceDisconnect.set(false).catch(function() {});
    }
    if (room[field] !== true) {
        onlineState.presenceRef.set(true).catch(function() {});
    }
}

function didOpponentLeaveOnlineRoom(room) {
    if (!room || room.status !== 'playing' || !onlineState.playerColor) return false;
    var myField = getOnlinePresenceField(onlineState.playerColor);
    var opponentField = getOnlinePresenceField(opponentColor(onlineState.playerColor));
    if (!myField || !opponentField) return false;
    if (typeof room[myField] !== 'boolean' || typeof room[opponentField] !== 'boolean') return false;
    return room[myField] === true && room[opponentField] === false;
}

function finalizeOnlineWinByOpponentLeaving() {
    if (!firebaseDb || !onlineState.roomId || !onlineState.playerColor || onlineState.claimingDisconnectWin || gameOver) return;
    onlineState.claimingDisconnectWin = true;
    setLobbyOnlineMessage('상대 연결 종료를 감지했습니다. 승리 처리 중입니다.');
    var payload = serializeCurrentGameState();
    payload.finalGameResult = onlineState.playerColor === 'white' ? '1-0' : '0-1';
    payload.finalGameTermination = '기권';
    payload.gameEndedAt = Date.now();
    firebaseDb.ref('rooms/' + onlineState.roomId).transaction(function(current) {
        if (!current || current.status !== 'playing') return current;
        var myField = getOnlinePresenceField(onlineState.playerColor);
        var opponentField = getOnlinePresenceField(opponentColor(onlineState.playerColor));
        if (!myField || !opponentField) return current;
        if (current[myField] !== true || current[opponentField] !== false) return current;
        current.status = 'finished';
        current.gameRevision = (current.gameRevision || 0) + 1;
        current.updatedAt = Date.now();
        current.gameState = payload;
        return current;
    }).catch(function(err) {
        setLobbyOnlineMessage('상대 이탈 처리 실패: ' + err.message);
    }).finally(function() {
        onlineState.claimingDisconnectWin = false;
    });
}

function applyOnlineGameState(serializedState) {
    serializedState = normalizeSerializedOnlineGameState(serializedState);
    onlineState.applyingRemoteState = true;
    cleanupDragState();
    restoreState(serializedState.state);
    moveHistory = serializedState.moveHistory.map(function(move) {
        return {
            notation: move.notation,
            color: move.color,
            durationMs: move.durationMs || 0,
            clockAfterMove: move.clockAfterMove
        };
    });
    finalGameResult = serializedState.finalGameResult || '*';
    finalGameTermination = serializedState.finalGameTermination || '';
    gameStartedAt = serializedState.gameStartedAt ? new Date(serializedState.gameStartedAt) : new Date();
    gameEndedAt = serializedState.gameEndedAt ? new Date(serializedState.gameEndedAt) : null;
    gameOver = finalGameResult !== '*';
    turnStartedAt = gameOver ? null : (isLocalOnlineTurn() ? Date.now() : null);
    stopTimer();
    aiThinking = false;
    showAIThinking(false);
    rebuildMoveListFromHistory();
    document.getElementById('gameover-modal').classList.remove('active');
    updatePGNActionButtons();
    renderBoard();
    updateUI();
    if (gameOver) {
        showResolvedGameOver();
    } else if (!gameSetting.unlimited && isLocalOnlineTurn()) {
        startTimer();
    }
    if (!gameOver) {
        closePGNModal();
        document.getElementById('promotion-modal').classList.remove('active');
    }
    if (!gameOver && isLocalOnlineTurn() && premoveQueue.length > 0) {
        setTimeout(function() { tryExecutePremove(); }, 0);
    } else if (isLocalOnlineTurn() && premoveQueue.length > 0) {
        clearPremoveQueue();
    }
    onlineState.applyingRemoteState = false;
}

function enterOnlineGameFromRoom(room) {
    if (!room) return;
    onlineState.enabled = true;
    onlineState.roomStarted = true;
    onlineState.gameRevision = room.gameRevision || 0;
    onlineState.playerColor = room.whiteUid === onlineState.clientId ? 'white' : (room.blackUid === onlineState.clientId ? 'black' : null);
    gameSetting.mode = 'online';
    gameSetting.minutes = room.settings && typeof room.settings.minutes === 'number' ? room.settings.minutes : 5;
    gameSetting.increment = room.settings && typeof room.settings.increment === 'number' ? room.settings.increment : 0;
    gameSetting.unlimited = !!(room.settings && room.settings.unlimited);
    gameSetting.whiteName = room.whiteName || '백';
    gameSetting.blackName = room.blackName || '흑';
    syncDisplayedPlayerNames();
    updateEndGameButton();
    updateGameOverModalButtons();
    document.getElementById('lobby-screen').classList.remove('active');
    document.getElementById('game-screen').classList.add('active');
    isFlipped = onlineState.playerColor === 'black';
    updateOnlinePresence(room);
    applyOnlineGameState(room.gameState || buildInitialOnlineGameState());
}

function leaveOnlineRoom(reasonText) {
    clearOnlinePresence();
    if (!firebaseDb || !onlineState.roomId || !onlineState.roomData) return Promise.resolve();
    var room = onlineState.roomData;
    if (room.status === 'waiting' && room.hostUid === onlineState.clientId) {
        return firebaseDb.ref('rooms/' + onlineState.roomId).remove();
    }
    if (room.status === 'playing') {
        var result = onlineState.playerColor === 'white' ? '0-1' : '1-0';
        var payload = serializeCurrentGameState();
        payload.finalGameResult = result;
        payload.finalGameTermination = reasonText || '기권';
        payload.gameEndedAt = Date.now();
        return firebaseDb.ref('rooms/' + onlineState.roomId).update({
            status: 'finished',
            gameRevision: (room.gameRevision || 0) + 1,
            updatedAt: firebase.database.ServerValue.TIMESTAMP,
            gameState: payload
        });
    }
    return Promise.resolve();
}

function resetOnlineSessionState() {
    onlineState.enabled = false;
    clearOnlinePresence();
    if (onlineState.roomRef && onlineState.roomListener) onlineState.roomRef.off('value', onlineState.roomListener);
    if (onlineState.assignmentRef && onlineState.assignmentListener) onlineState.assignmentRef.off('value', onlineState.assignmentListener);
    onlineState.roomRef = null;
    onlineState.roomListener = null;
    onlineState.assignmentRef = null;
    onlineState.assignmentListener = null;
    onlineState.roomId = null;
    onlineState.roomData = null;
    onlineState.playerColor = null;
    onlineState.claimingDisconnectWin = false;
    onlineState.roomStarted = false;
    onlineState.inQueue = false;
    onlineState.queueRef = null;
    onlineState.gameRevision = -1;
    onlineState.lastSyncedStateHash = null;
    onlineState.showJoinRoomInput = false;
    drawOfferBy = null;
    updateOnlineUI();
}

function toggleJoinRoomPanel() {
    if (onlineState.roomData && onlineState.roomData.status === 'playing') return;
    onlineState.showJoinRoomInput = !onlineState.showJoinRoomInput;
    updateOnlineUI();
}

function closeJoinRoomPanel() {
    if (!onlineState.showJoinRoomInput) return;
    onlineState.showJoinRoomInput = false;
    updateOnlineUI();
}

function toggleCreateRoomAction() {
    if (isOwnedInviteRoomWaiting()) {
        deleteInviteRoom();
        return;
    }
    createInviteRoom();
}

function deleteInviteRoom() {
    if (!isOwnedInviteRoomWaiting()) return Promise.resolve();
    return cancelOnlineWaiting().then(function() {
        setLobbyOnlineMessage('방을 삭제했습니다.');
    }).catch(function(err) {
        setLobbyOnlineMessage('방 삭제 실패: ' + err.message);
        throw err;
    });
}

function clearOnlineTransientState() {
    var tasks = [];
    clearOnlinePresence();
    if (onlineState.queueRef) tasks.push(onlineState.queueRef.remove());
    if (onlineState.assignmentRef) tasks.push(onlineState.assignmentRef.remove());
    if (onlineState.roomRef && onlineState.roomListener) onlineState.roomRef.off('value', onlineState.roomListener);
    if (onlineState.assignmentRef && onlineState.assignmentListener) onlineState.assignmentRef.off('value', onlineState.assignmentListener);
    onlineState.roomRef = null;
    onlineState.roomListener = null;
    onlineState.assignmentRef = null;
    onlineState.assignmentListener = null;
    onlineState.roomId = null;
    onlineState.roomData = null;
    onlineState.playerColor = null;
    onlineState.claimingDisconnectWin = false;
    onlineState.roomStarted = false;
    onlineState.inQueue = false;
    onlineState.queueRef = null;
    onlineState.gameRevision = -1;
    onlineState.lastSyncedStateHash = null;
    onlineState.enabled = false;
    drawOfferBy = null;
    updateOnlineUI();
    return Promise.all(tasks);
}

function toggleRandomMatch() {
    if (onlineState.inQueue) {
        cancelOnlineWaiting();
        return;
    }
    startRandomMatch();
}

function subscribeToRoom(roomId) {
    if (!firebaseDb) return;
    if (onlineState.roomRef && onlineState.roomListener) onlineState.roomRef.off('value', onlineState.roomListener);
    onlineState.roomId = roomId;
    onlineState.roomRef = firebaseDb.ref('rooms/' + roomId);
    onlineState.roomListener = function(snapshot) {
        var room = snapshot.val();
        if (!room) {
            setLobbyOnlineMessage('방을 찾을 수 없습니다.');
            resetOnlineSessionState();
            document.getElementById('game-screen').classList.remove('active');
            document.getElementById('lobby-screen').classList.add('active');
            return;
        }
        onlineState.roomData = room;
        onlineState.playerColor = room.whiteUid === onlineState.clientId ? 'white' : (room.blackUid === onlineState.clientId ? 'black' : null);
        gameSetting.whiteName = room.whiteName || '백';
        gameSetting.blackName = room.blackName || '흑';
        syncDisplayedPlayerNames();
        updateOnlinePresence(room);
        updateOnlineUI();
        if (room.status === 'waiting') {
            setLobbyOnlineMessage(room.hostUid === onlineState.clientId ? '친구를 기다리는 중입니다.' : '방 참가 처리 중입니다.');
            return;
        }
        if (room.status === 'playing' || room.status === 'finished') {
            setLobbyOnlineMessage(room.status === 'playing' ? '대국이 시작되었습니다.' : '대국이 종료되었습니다.');
            var nextRevision = room.gameRevision || 0;
            if (!onlineState.roomStarted) enterOnlineGameFromRoom(room);
            else if (nextRevision !== onlineState.gameRevision) {
                onlineState.gameRevision = nextRevision;
                applyOnlineGameState(room.gameState);
            }
            if (room.status === 'playing' && didOpponentLeaveOnlineRoom(room)) {
                finalizeOnlineWinByOpponentLeaving();
            }
        }
    };
    onlineState.roomRef.on('value', onlineState.roomListener);
}

function syncOnlineGameState(reason) {
    if (!isOnlineMode() || !onlineState.roomId || onlineState.applyingRemoteState || !firebaseDb) return Promise.resolve(false);
    var payload = serializeCurrentGameState();
    var hash = JSON.stringify(payload);
    if (reason !== 'tick' && onlineState.lastSyncedStateHash === hash) return Promise.resolve(false);
    onlineState.syncingState = true;
    onlineState.lastSyncedStateHash = hash;
    onlineState.gameRevision = (onlineState.gameRevision || 0) + 1;
    return firebaseDb.ref('rooms/' + onlineState.roomId).update({
        status: gameOver ? 'finished' : 'playing',
        gameRevision: onlineState.gameRevision,
        gameState: payload,
        updatedAt: firebase.database.ServerValue.TIMESTAMP
    }).finally(function() {
        onlineState.syncingState = false;
    });
}

function createInviteRoom() {
    ensureFirebaseReady().then(function() {
        cancelOnlineWaiting();
        onlineState.showJoinRoomInput = false;
        var nickname = requireOnlineNickname();
        var roomId = generateRoomCode();
        var roomData = {
            type: 'invite',
            status: 'waiting',
            hostUid: onlineState.clientId,
            hostName: nickname,
            guestUid: null,
            guestName: null,
            whiteUid: onlineState.clientId,
            blackUid: null,
            whiteName: nickname,
            blackName: null,
            whiteConnected: true,
            blackConnected: false,
            settings: getSelectedTimeSettings(),
            gameRevision: 0,
            gameState: buildInitialOnlineGameState(),
            createdAt: firebase.database.ServerValue.TIMESTAMP,
            updatedAt: firebase.database.ServerValue.TIMESTAMP
        };
        return firebaseDb.ref('rooms/' + roomId).set(roomData).then(function() {
            subscribeToRoom(roomId);
            setLobbyOnlineMessage('방이 생성되었습니다. 친구에게 코드를 공유하세요.');
            updateOnlineUI();
        });
    }).catch(function(err) {
        setLobbyOnlineMessage('방 생성 실패: ' + err.message);
    });
}

function attemptJoinInviteRoom(roomRef, roomId, nickname, allowRetry) {
    return roomRef.once('value').then(function(snapshot) {
        var current = snapshot.val();
        if (!current) throw new Error('존재하지 않는 방 코드입니다.');
        if (current.blackUid === onlineState.clientId || current.guestUid === onlineState.clientId) {
            return current;
        }
        if (current.status !== 'waiting') throw new Error('이미 시작되었거나 사용할 수 없는 방입니다.');
        if (current.guestUid) throw new Error('이미 다른 참가자가 입장한 방입니다.');

        if (allowRetry && current.hostUid === onlineState.clientId) {
            refreshOnlineClientId();
            return attemptJoinInviteRoom(roomRef, roomId, nickname, false);
        }

        return roomRef.update({
            guestUid: onlineState.clientId,
            guestName: nickname,
            blackUid: onlineState.clientId,
            blackName: nickname,
            whiteConnected: current.whiteConnected !== false,
            blackConnected: true,
            status: 'playing',
            updatedAt: firebase.database.ServerValue.TIMESTAMP
        }).then(function() {
            return roomRef.once('value');
        }).then(function(verifySnapshot) {
            var verified = verifySnapshot.val();
            if (!verified) throw new Error('존재하지 않는 방 코드입니다.');
            if (verified.blackUid === onlineState.clientId || verified.guestUid === onlineState.clientId) {
                return verified;
            }
            if (verified.guestUid && verified.guestUid !== onlineState.clientId) {
                throw new Error('이미 다른 참가자가 입장한 방입니다.');
            }
            if (verified.status !== 'waiting' && verified.status !== 'playing') {
                throw new Error('이미 시작되었거나 사용할 수 없는 방입니다.');
            }
            throw new Error('방 참가 처리에 실패했습니다. 다시 시도해주세요.');
        });
    });
}

function joinRoomByCode() {
    ensureFirebaseReady().then(function() {
        var input = document.getElementById('room-code-input');
        var roomId = normalizeRoomCode(input && input.value);
        if (!roomId) throw new Error('방 코드를 입력해주세요.');
        var nickname = requireOnlineNickname();
        var roomRef = firebaseDb.ref('rooms/' + roomId);
        return clearOnlineTransientState().then(function() {
            return roomRef.once('value');
        }).then(function(snapshot) {
            var room = snapshot.val();
            if (!room) throw new Error('존재하지 않는 방 코드입니다.');
            if (room.status !== 'waiting') throw new Error('이미 시작되었거나 사용할 수 없는 방입니다.');
            if (room.guestUid) throw new Error('이미 다른 참가자가 입장한 방입니다.');

            // 같은 브라우저에서 탭 복제 등으로 세션 ID가 겹치면 참가자용 ID를 새로 만든다.
            if (room.hostUid === onlineState.clientId) {
                refreshOnlineClientId();
            }

            return attemptJoinInviteRoom(roomRef, roomId, nickname, true);
        }).then(function() {
            onlineState.showJoinRoomInput = false;
            subscribeToRoom(roomId);
            firebaseDb.ref('rooms/' + roomId + '/updatedAt').set(firebase.database.ServerValue.TIMESTAMP);
            setLobbyOnlineMessage('방에 참가했습니다.');
        });
    }).catch(function(err) {
        setLobbyOnlineMessage('방 참가 실패: ' + err.message);
    });
}

function copyInviteCode() {
    if (!onlineState.roomId) return;
    var roomCode = onlineState.roomId;
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(roomCode).then(function() {
            setLobbyOnlineMessage('방 코드가 복사되었습니다.');
        });
        return;
    }
    setLobbyOnlineMessage('방 코드: ' + roomCode);
}

function waitForRandomAssignment() {
    if (!firebaseDb || !onlineState.clientId) return;
    if (onlineState.assignmentRef && onlineState.assignmentListener) onlineState.assignmentRef.off('value', onlineState.assignmentListener);
    onlineState.assignmentRef = firebaseDb.ref('matchAssignments/' + onlineState.clientId);
    onlineState.assignmentListener = function(snapshot) {
        var roomId = snapshot.val();
        if (!roomId) return;
        onlineState.inQueue = false;
        if (onlineState.queueRef) onlineState.queueRef.remove();
        subscribeToRoom(roomId);
        onlineState.assignmentRef.remove();
        setLobbyOnlineMessage('상대를 찾았습니다. 방에 입장합니다.');
        updateOnlineUI();
    };
    onlineState.assignmentRef.on('value', onlineState.assignmentListener);
}

function createRandomRoomWithOpponent(opponent, nickname) {
    var roomId = generateRoomCode();
    var roomData = {
        type: 'random',
        status: 'playing',
        hostUid: opponent.uid,
        hostName: opponent.name,
        guestUid: onlineState.clientId,
        guestName: nickname,
        whiteUid: opponent.uid,
        blackUid: onlineState.clientId,
        whiteName: opponent.name,
        blackName: nickname,
        whiteConnected: true,
        blackConnected: true,
        settings: getSelectedTimeSettings(),
        gameRevision: 0,
        gameState: buildInitialOnlineGameState(),
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        updatedAt: firebase.database.ServerValue.TIMESTAMP
    };
    var updates = {};
    updates['rooms/' + roomId] = roomData;
    updates['matchAssignments/' + opponent.uid] = roomId;
    updates['matchAssignments/' + onlineState.clientId] = roomId;
    updates['matchmaking/' + getMatchmakingKey()] = null;
    return firebaseDb.ref().update(updates).then(function() {
        setLobbyOnlineMessage('랜덤 매칭 상대를 찾았습니다.');
    });
}

function startRandomMatch() {
    ensureFirebaseReady().then(function() {
        cancelOnlineWaiting();
        onlineState.showJoinRoomInput = false;
        var queueKey = getMatchmakingKey();
        var nickname = requireOnlineNickname();
        var queueRef = firebaseDb.ref('matchmaking/' + queueKey);
        onlineState.inQueue = true;
        onlineState.queueRef = queueRef;
        waitForRandomAssignment();
        setLobbyOnlineMessage('랜덤 매칭 상대를 찾는 중입니다...');
        updateOnlineUI();
        var matchedOpponent = null;
        return queueRef.transaction(function(current) {
            if (current && current.uid && current.uid !== onlineState.clientId) {
                matchedOpponent = current;
                return null;
            }
            if (!current) {
                return {
                    uid: onlineState.clientId,
                    name: nickname,
                    minutes: gameSetting.minutes,
                    increment: gameSetting.increment,
                    unlimited: gameSetting.unlimited,
                    createdAt: Date.now()
                };
            }
            return current;
        }).then(function(result) {
            if (matchedOpponent) return createRandomRoomWithOpponent(matchedOpponent, nickname);
            if (!result.committed) throw new Error('매칭 대기열 등록에 실패했습니다.');
            setLobbyOnlineMessage('대기열에 등록되었습니다. 상대를 기다리는 중입니다.');
        });
    }).catch(function(err) {
        onlineState.inQueue = false;
        updateOnlineUI();
        setLobbyOnlineMessage('랜덤 매칭 실패: ' + err.message);
    });
}

function cancelOnlineWaiting() {
    var tasks = [];
    if (onlineState.queueRef) tasks.push(onlineState.queueRef.remove());
    if (onlineState.assignmentRef) tasks.push(onlineState.assignmentRef.remove());
    if (onlineState.roomData && onlineState.roomData.status === 'waiting' && onlineState.roomData.hostUid === onlineState.clientId && onlineState.roomId && firebaseDb) {
        tasks.push(firebaseDb.ref('rooms/' + onlineState.roomId).remove());
    }
    if (onlineState.assignmentRef && onlineState.assignmentListener) onlineState.assignmentRef.off('value', onlineState.assignmentListener);
    onlineState.assignmentRef = null;
    onlineState.assignmentListener = null;
    onlineState.queueRef = null;
    onlineState.inQueue = false;
    if (onlineState.roomData && onlineState.roomData.status === 'waiting') {
        if (onlineState.roomRef && onlineState.roomListener) onlineState.roomRef.off('value', onlineState.roomListener);
        onlineState.roomRef = null;
        onlineState.roomListener = null;
        onlineState.roomId = null;
        onlineState.roomData = null;
    }
    updateOnlineUI();
    setLobbyOnlineMessage('온라인 대기를 취소했습니다.');
    return Promise.all(tasks);
}

function canControlPiece(row, col) {
    if (gameOver || isAITurn() || aiThinking) return false;
    var piece = board[row][col];
    if (!piece || pieceColor(piece) !== currentTurn) return false;
    if (isOnlineMode() && (!onlineState.playerColor || pieceColor(piece) !== onlineState.playerColor)) return false;
    if (gameSetting.mode === 'ai' && pieceColor(piece) === gameSetting.aiColor) return false;
    return true;
}

function cloneCastlingRights(rights) {
    return { K: rights.K, Q: rights.Q, k: rights.k, q: rights.q };
}

function createBoardStateSnapshot() {
    return {
        board: cloneBoard(board),
        castlingRights: cloneCastlingRights(castlingRights),
        enPassantTarget: enPassantTarget ? enPassantTarget.slice() : null
    };
}

function getPremoveActorColor() {
    if (gameOver) return null;
    if (isOnlineMode()) {
        return currentTurn !== onlineState.playerColor ? onlineState.playerColor : null;
    }
    if (gameSetting.mode === 'ai') {
        return currentTurn !== gameSetting.playerColor ? gameSetting.playerColor : null;
    }
    return opponentColor(currentTurn);
}

function legalMovesForState(state, row, col) {
    var piece = state.board[row][col];
    if (!piece) return [];
    var color = pieceColor(piece);
    var pseudo = pseudoLegalMoves(state.board, row, col, state.castlingRights, state.enPassantTarget);
    var legal = [];
    for (var i = 0; i < pseudo.length; i++) {
        var tr = pseudo[i][0], tc = pseudo[i][1];
        var target = state.board[tr][tc];
        if (target && target.toUpperCase() === 'K') continue;
        var testBoard = cloneBoard(state.board);
        if (piece.toUpperCase() === 'P' && state.enPassantTarget && tr === state.enPassantTarget[0] && tc === state.enPassantTarget[1]) {
            testBoard[color === 'white' ? tr + 1 : tr - 1][tc] = '';
        }
        if (piece.toUpperCase() === 'K' && Math.abs(tc - col) === 2) {
            if (tc === 6) { testBoard[row][5] = testBoard[row][7]; testBoard[row][7] = ''; }
            if (tc === 2) { testBoard[row][3] = testBoard[row][0]; testBoard[row][0] = ''; }
        }
        testBoard[tr][tc] = testBoard[row][col];
        testBoard[row][col] = '';
        if (!isInCheck(testBoard, color)) legal.push([tr, tc]);
    }
    return legal;
}

function getDefaultPromotionPiece(piece) {
    return pieceColor(piece) === 'white' ? 'Q' : 'q';
}

function applyMoveToState(state, move) {
    var piece = state.board[move.fromRow][move.fromCol];
    if (!piece) return false;
    if (!isLegalDestination(move.toRow, move.toCol, legalMovesForState(state, move.fromRow, move.fromCol))) return false;

    if (piece.toUpperCase() === 'P' && state.enPassantTarget && move.toRow === state.enPassantTarget[0] && move.toCol === state.enPassantTarget[1]) {
        state.board[pieceColor(piece) === 'white' ? move.toRow + 1 : move.toRow - 1][move.toCol] = '';
    }

    if (piece.toUpperCase() === 'K' && Math.abs(move.toCol - move.fromCol) === 2) {
        if (move.toCol === 6) { state.board[move.fromRow][5] = state.board[move.fromRow][7]; state.board[move.fromRow][7] = ''; }
        else { state.board[move.fromRow][3] = state.board[move.fromRow][0]; state.board[move.fromRow][0] = ''; }
    }

    state.board[move.toRow][move.toCol] = piece;
    state.board[move.fromRow][move.fromCol] = '';

    if (piece.toUpperCase() === 'P' && Math.abs(move.toRow - move.fromRow) === 2) state.enPassantTarget = [(move.fromRow + move.toRow) / 2, move.fromCol];
    else state.enPassantTarget = null;

    if (piece.toUpperCase() === 'P' && (move.toRow === 0 || move.toRow === 7)) {
        state.board[move.toRow][move.toCol] = move.promotionPiece || getDefaultPromotionPiece(piece);
    }

    if (piece === 'K') { state.castlingRights.K = false; state.castlingRights.Q = false; }
    if (piece === 'k') { state.castlingRights.k = false; state.castlingRights.q = false; }
    if (piece === 'R' && move.fromRow === 7 && move.fromCol === 7) state.castlingRights.K = false;
    if (piece === 'R' && move.fromRow === 7 && move.fromCol === 0) state.castlingRights.Q = false;
    if (piece === 'r' && move.fromRow === 0 && move.fromCol === 7) state.castlingRights.k = false;
    if (piece === 'r' && move.fromRow === 0 && move.fromCol === 0) state.castlingRights.q = false;
    if (move.toRow === 7 && move.toCol === 7) state.castlingRights.K = false;
    if (move.toRow === 7 && move.toCol === 0) state.castlingRights.Q = false;
    if (move.toRow === 0 && move.toCol === 7) state.castlingRights.k = false;
    if (move.toRow === 0 && move.toCol === 0) state.castlingRights.q = false;

    return true;
}

function clearPremoveQueue() {
    premoveQueue = [];
}

function cancelPremove(event) {
    if (premoveQueue.length === 0) return false;
    if (event && event.preventDefault) event.preventDefault();
    cleanupDragState();
    clearPremoveQueue();
    renderBoard();
    updateUI();
    return true;
}

function buildPremovePreviewState() {
    var actorColor = getPremoveActorColor();
    if (!actorColor) return null;

    // A premove may depend on the opponent changing the position first
    // (for example, recapturing onto a square currently occupied by our own piece).
    // We keep the current board as the preview state and validate only when the turn returns.
    return createBoardStateSnapshot();
}

function canStartPremove(row, col, previewState) {
    var actorColor = getPremoveActorColor();
    var state = previewState || buildPremovePreviewState();
    if (!actorColor || !state) return false;
    var piece = state.board[row][col];
    if (!piece || pieceColor(piece) !== actorColor) return false;
    if (gameSetting.mode === 'ai' && actorColor === gameSetting.aiColor) return false;
    return true;
}

function relaxedPremoveMovesForState(state, row, col) {
    var piece = state.board[row][col];
    if (!piece) return [];

    var type = piece.toUpperCase();
    var color = pieceColor(piece);
    var moves = [];

    function addMove(nr, nc) {
        if (!inBounds(nr, nc)) return;
        if (nr === row && nc === col) return;
        moves.push([nr, nc]);
    }

    function addRay(dr, dc) {
        var nr = row + dr;
        var nc = col + dc;
        while (inBounds(nr, nc)) {
            addMove(nr, nc);
            nr += dr;
            nc += dc;
        }
    }

    if (type === 'P') {
        var dir = color === 'white' ? -1 : 1;
        var startRow = color === 'white' ? 6 : 1;
        addMove(row + dir, col);
        if (row === startRow) addMove(row + dir * 2, col);
        addMove(row + dir, col - 1);
        addMove(row + dir, col + 1);
    } else if (type === 'N') {
        [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(function(offset) {
            addMove(row + offset[0], col + offset[1]);
        });
    } else if (type === 'B') {
        [[-1,-1],[-1,1],[1,-1],[1,1]].forEach(function(direction) {
            addRay(direction[0], direction[1]);
        });
    } else if (type === 'R') {
        [[-1,0],[1,0],[0,-1],[0,1]].forEach(function(direction) {
            addRay(direction[0], direction[1]);
        });
    } else if (type === 'Q') {
        [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]].forEach(function(direction) {
            addRay(direction[0], direction[1]);
        });
    } else if (type === 'K') {
        for (var dr = -1; dr <= 1; dr++) {
            for (var dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                addMove(row + dr, col + dc);
            }
        }
        if ((color === 'white' && row === 7 && col === 4) || (color === 'black' && row === 0 && col === 4)) {
            addMove(row, 6);
            addMove(row, 2);
        }
    }

    return moves;
}

function canDragPiece(row, col) {
    if (canControlPiece(row, col)) return true;
    return canStartPremove(row, col);
}

function setSelection(row, col, moves, mode, piece) {
    selectedSquare = [row, col];
    possibleMoves = moves.slice();
    selectedInteractionMode = mode;
    selectedPiece = piece;
}

function queuePremove(fromRow, fromCol, toRow, toCol, promotionPiece) {
    premoveQueue = [{
        fromRow: fromRow,
        fromCol: fromCol,
        toRow: toRow,
        toCol: toCol,
        promotionPiece: promotionPiece || null
    }];
    cleanupDragState();
    renderBoard();
    updateUI();
}

function tryExecutePremove() {
    if (gameOver || premoveQueue.length === 0) return false;
    if (isOnlineMode() && !isLocalOnlineTurn()) return false;

    var nextMove = premoveQueue[0];
    var piece = board[nextMove.fromRow][nextMove.fromCol];
    if (!piece || pieceColor(piece) !== currentTurn) {
        clearPremoveQueue();
        return false;
    }

    var legal = legalMoves(nextMove.fromRow, nextMove.fromCol);
    if (!isLegalDestination(nextMove.toRow, nextMove.toCol, legal)) {
        clearPremoveQueue();
        return false;
    }

    premoveQueue.shift();
    var promotionPiece = nextMove.promotionPiece;
    if (piece.toUpperCase() === 'P' && (nextMove.toRow === 0 || nextMove.toRow === 7) && !promotionPiece) {
        promotionPiece = getDefaultPromotionPiece(piece);
    }
    executeMove(nextMove.fromRow, nextMove.fromCol, nextMove.toRow, nextMove.toCol, promotionPiece, { forceDurationMs: 0 });
    return true;
}

function isLegalDestination(row, col, moves) {
    for (var i = 0; i < moves.length; i++) {
        if (moves[i][0] === row && moves[i][1] === col) return true;
    }
    return false;
}

function clearDragHighlights() {
    document.querySelectorAll('.square').forEach(function(square) {
        square.classList.remove('selected', 'possible-move', 'capture-move', 'drag-over');
    });
    document.querySelectorAll('.piece-svg.dragging').forEach(function(pieceEl) {
        pieceEl.classList.remove('dragging');
    });
}

function destroyDragGhost() {
    if (!dragGhostEl) return;
    if (dragGhostEl.parentNode) dragGhostEl.parentNode.removeChild(dragGhostEl);
    dragGhostEl = null;
}

function ensureDragGhost(pieceMarkup) {
    if (dragGhostEl) return dragGhostEl;
    dragGhostEl = document.createElement('div');
    dragGhostEl.className = 'drag-ghost';
    dragGhostEl.innerHTML = pieceMarkup || '';
    document.body.appendChild(dragGhostEl);
    return dragGhostEl;
}

function updateDragGhostPosition(clientX, clientY) {
    if (!dragState || !dragState.hasMoved) return;
    var ghost = ensureDragGhost(dragState.pieceMarkup);
    ghost.style.left = Math.round(clientX - dragState.dragOffsetX) + 'px';
    ghost.style.top = Math.round(clientY - dragState.dragOffsetY) + 'px';
}

function getSquareFromPoint(clientX, clientY) {
    var el = document.elementFromPoint(clientX, clientY);
    if (!el) return null;
    var square = el.closest ? el.closest('.square') : null;
    if (!square) return null;
    var row = Number(square.dataset.row);
    var col = Number(square.dataset.col);
    if (!Number.isInteger(row) || !Number.isInteger(col)) return null;
    return { row: row, col: col, element: square };
}

function refreshPointerDragTarget(clientX, clientY) {
    if (!dragState) return;
    clearDragHighlights();
    applyDragHighlights();
    var target = getSquareFromPoint(clientX, clientY);
    if (target && isLegalDestination(target.row, target.col, dragState.moves)) {
        target.element.classList.add('drag-over');
    }
}

function applyDragHighlights() {
    if (!dragState) return;

    var originSquare = document.querySelector('.square[data-row="' + dragState.fromRow + '"][data-col="' + dragState.fromCol + '"]');
    if (originSquare) originSquare.classList.add('selected');

    dragState.moves.forEach(function(move) {
        var square = document.querySelector('.square[data-row="' + move[0] + '"][data-col="' + move[1] + '"]');
        if (!square) return;
        if (board[move[0]][move[1]]) square.classList.add('capture-move');
        else square.classList.add('possible-move');
    });
}

function cleanupDragState() {
    destroyDragGhost();
    clearDragHighlights();
    dragState = null;
    selectedSquare = null;
    possibleMoves = [];
    selectedInteractionMode = null;
    selectedPiece = null;
}

function releaseDragState(preserveSelection) {
    if (!dragState) {
        if (!preserveSelection) cleanupDragState();
        return;
    }

    var snapshot = preserveSelection ? {
        fromRow: dragState.fromRow,
        fromCol: dragState.fromCol,
        moves: dragState.moves.slice(),
        mode: dragState.mode,
        piece: dragState.piece
    } : null;

    destroyDragGhost();
    clearDragHighlights();
    dragState = null;

    if (snapshot) {
        setSelection(snapshot.fromRow, snapshot.fromCol, snapshot.moves, snapshot.mode, snapshot.piece);
        return;
    }

    selectedSquare = null;
    possibleMoves = [];
    selectedInteractionMode = null;
    selectedPiece = null;
}

function startPointerDrag(row, col, pieceEl, event) {
    if (event && typeof event.button === 'number' && event.button !== 0) return;
    if (event && event.preventDefault) event.preventDefault();
    suppressBoardClickUntil = Date.now() + 250;
    startPieceDrag(row, col, pieceEl, event);
}

function hoverPointerDragTarget(row, col, squareEl) {
    if (!dragState) return;
    refreshPointerDragTarget(
        dragState.lastClientX != null ? dragState.lastClientX : 0,
        dragState.lastClientY != null ? dragState.lastClientY : 0
    );
}

function handlePointerDragMove(event) {
    if (!dragState) return;
    dragState.lastClientX = event.clientX;
    dragState.lastClientY = event.clientY;

    var deltaX = event.clientX - dragState.startClientX;
    var deltaY = event.clientY - dragState.startClientY;
    if (!dragState.hasMoved) {
        if ((deltaX * deltaX) + (deltaY * deltaY) < 16) return;
        dragState.hasMoved = true;
        if (dragState.sourceEl) dragState.sourceEl.classList.add('dragging');
    }

    updateDragGhostPosition(event.clientX, event.clientY);
    refreshPointerDragTarget(event.clientX, event.clientY);
}

function endPointerDragFromPoint(clientX, clientY, shouldCommit) {
    if (!dragState) return;

    if (!dragState.hasMoved) {
        releaseDragState(true);
        renderBoard();
        return;
    }

    var target = shouldCommit ? getSquareFromPoint(clientX, clientY) : null;
    if (target && isLegalDestination(target.row, target.col, dragState.moves)) {
        finishDragMove(target.row, target.col);
        return;
    }

    var preserveSelection = dragState.mode === 'premove' && premoveQueue.length === 0;
    releaseDragState(preserveSelection);
    renderBoard();
}

function startPieceDrag(row, col, pieceEl, event) {
    var mode = canControlPiece(row, col) ? 'live' : (canStartPremove(row, col) ? 'premove' : null);
    if (!mode) {
        if (event && event.preventDefault) event.preventDefault();
        return;
    }

    var previewState = mode === 'premove' ? buildPremovePreviewState() : null;
    var moves = mode === 'live' ? legalMoves(row, col) : relaxedPremoveMovesForState(previewState, row, col);
    if (moves.length === 0) {
        if (event && event.preventDefault) event.preventDefault();
        return;
    }

    var piece = mode === 'live' ? board[row][col] : previewState.board[row][col];

    cleanupDragState();
    var pieceRect = pieceEl && pieceEl.getBoundingClientRect ? pieceEl.getBoundingClientRect() : null;
    dragState = {
        fromRow: row,
        fromCol: col,
        moves: moves,
        mode: mode,
        piece: piece,
        pieceMarkup: pieceEl ? pieceEl.innerHTML : '',
        sourceEl: pieceEl || null,
        startClientX: event && typeof event.clientX === 'number' ? event.clientX : 0,
        startClientY: event && typeof event.clientY === 'number' ? event.clientY : 0,
        lastClientX: event && typeof event.clientX === 'number' ? event.clientX : 0,
        lastClientY: event && typeof event.clientY === 'number' ? event.clientY : 0,
        dragOffsetX: pieceRect && event && typeof event.clientX === 'number' ? (event.clientX - pieceRect.left) : 0,
        dragOffsetY: pieceRect && event && typeof event.clientY === 'number' ? (event.clientY - pieceRect.top) : 0,
        hasMoved: false
    };
    setSelection(row, col, moves, mode, piece);
    applyDragHighlights();

    if (pieceEl) pieceEl.classList.add('dragging');

    if (event && event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', row + ',' + col);
    }
}

function finishDragMove(toRow, toCol) {
    if (!dragState || !isLegalDestination(toRow, toCol, dragState.moves)) {
        cleanupDragState();
        renderBoard();
        return;
    }

    var fromRow = dragState.fromRow;
    var fromCol = dragState.fromCol;
    var movingPiece = dragState.piece;
    var moveMode = dragState.mode;

    cleanupDragState();

    if (movingPiece && movingPiece.toUpperCase() === 'P' && (toRow === 0 || toRow === 7)) {
        showPromotionModal(fromRow, fromCol, toRow, toCol, moveMode, movingPiece);
    } else if (moveMode === 'premove') {
        queuePremove(fromRow, fromCol, toRow, toCol, null);
    } else {
        executeMove(fromRow, fromCol, toRow, toCol, null);
    }
}

// ============================================================
//  로비 로직
// ============================================================
function updateModeSelectionUI() {
    document.querySelectorAll('.mode-btn').forEach(function(btn) { btn.classList.remove('active'); });
    var activeModeBtn = document.querySelector('.mode-btn[data-mode="' + gameSetting.mode + '"]');
    if (activeModeBtn) activeModeBtn.classList.add('active');

    var localPanel = document.getElementById('local-mode-panel');
    var localSelectBtn = document.getElementById('local-mode-select-btn');
    var isLocalMode = gameSetting.mode === 'pvp';

    if (localPanel) localPanel.classList.toggle('active', isLocalMode);
    if (localSelectBtn) {
        localSelectBtn.classList.toggle('active', isLocalMode);
        localSelectBtn.textContent = isLocalMode ? '현재 선택됨' : '로컬 PvP 선택';
    }
}

function selectMode(mode) {
    gameSetting.mode = mode;
    updateModeSelectionUI();
    
    // ★ AI 설정 패널 토글
    var aiSettings = document.getElementById('ai-settings');
    var onlineSettings = document.getElementById('online-settings');
    if (mode === 'ai') aiSettings.classList.add('visible');
    else aiSettings.classList.remove('visible');

    if (mode === 'online') {
        onlineSettings.classList.add('visible');
        ensureFirebaseReady().then(function() {
            setLobbyOnlineMessage('닉네임을 입력하면 방을 만들거나 참가할 수 있습니다.');
        }).catch(function() {});
    } else {
        onlineSettings.classList.remove('visible');
    }
    updateEndGameButton();
    updateGameOverModalButtons();
    updateOnlineUI();
}

// ★ AI 색상 선택 (플레이어가 선택하는 색상)
function selectAIColor(color) {
    document.querySelectorAll('.ai-color-btn').forEach(function(btn) { btn.classList.remove('active'); });
    document.querySelector('.ai-color-btn[data-color="' + color + '"]').classList.add('active');
    
    if (color === 'random') {
        gameSetting.playerColor = Math.random() < 0.5 ? 'white' : 'black';
    } else {
        gameSetting.playerColor = color;
    }
    gameSetting.aiColor = gameSetting.playerColor === 'white' ? 'black' : 'white';
}

// ★ AI 난이도 선택
function selectAILevel(level) {
    var parsedLevel = parseInt(level, 10);
    if (isNaN(parsedLevel)) parsedLevel = gameSetting.aiLevel;
    gameSetting.aiLevel = Math.max(AI_LEVEL_MIN, Math.min(AI_LEVEL_MAX, parsedLevel));
    updateAILevelUI();
}

function adjustAILevel(delta) {
    selectAILevel(gameSetting.aiLevel + delta);
}

function getAILevelLabel(level) {
    if (level <= 4) return '입문';
    if (level <= 8) return '초급';
    if (level <= 12) return '중급';
    if (level <= 16) return '상급';
    return '최상';
}

function updateAILevelUI() {
    var level = Math.max(AI_LEVEL_MIN, Math.min(AI_LEVEL_MAX, gameSetting.aiLevel));
    var rangeEl = document.getElementById('ai-level-range');
    var valueEl = document.getElementById('ai-level-value');
    var captionEl = document.getElementById('ai-level-caption');
    var wrapperEl = document.querySelector('.ai-level-select');

    gameSetting.aiLevel = level;

    if (rangeEl) rangeEl.value = level;
    if (valueEl) valueEl.textContent = 'Lv. ' + level;
    if (captionEl) captionEl.textContent = getAILevelLabel(level);
    if (wrapperEl) wrapperEl.classList.toggle('active', level >= 15);
}

function applyPreset(minutes, increment, el) {
    document.querySelectorAll('.preset-btn').forEach(function(btn) { btn.classList.remove('active'); });
    if (el) el.classList.add('active');
    document.getElementById('custom-minutes').value = minutes;
    document.getElementById('custom-increment').value = increment;
    gameSetting.minutes = minutes;
    gameSetting.increment = increment;
    gameSetting.unlimited = (minutes === 0 && increment === 0);
    updateTimeSummary();
}

function adjustTime(type, delta) {
    var input = document.getElementById(type === 'minutes' ? 'custom-minutes' : 'custom-increment');
    var val = parseInt(input.value) || 0;
    val += delta;
    if (type === 'minutes') val = Math.max(0, Math.min(180, val));
    else val = Math.max(0, Math.min(60, val));
    input.value = val;
    updateCustomPreset();
}

function updateCustomPreset() {
    var minutes = parseInt(document.getElementById('custom-minutes').value) || 0;
    var increment = parseInt(document.getElementById('custom-increment').value) || 0;
    gameSetting.minutes = minutes;
    gameSetting.increment = increment;
    gameSetting.unlimited = (minutes === 0 && increment === 0);
    document.querySelectorAll('.preset-btn').forEach(function(btn) { btn.classList.remove('active'); });
    document.querySelectorAll('.preset-btn').forEach(function(btn) {
        var m = btn.getAttribute('data-minutes');
        var i = btn.getAttribute('data-increment');
        if (m !== null && parseInt(m) === minutes && parseInt(i) === increment) btn.classList.add('active');
    });
    updateTimeSummary();
}

/* function updateTimeSummary() {
    var el = document.getElementById('time-summary-text');
    if (gameSetting.unlimited) {
        el.textContent = '⏱️ 시간 제한 없음 (무제한)';
    } else {
        el.textContent = '⏱️ 각 플레이어: ' + (gameSetting.minutes > 0 ? gameSetting.minutes + '분' : '0분') + ' | 추가 시간(수 당): ' + (gameSetting.increment > 0 ? gameSetting.increment + '초' : '없음');
    }
}

// ★ 게임 시작 (AI 모드 시 엔진 로딩 포함)
*/

function updateTimeSummary() {
    var el = document.getElementById('time-summary-text');
    if (gameSetting.unlimited) {
        el.textContent = '시간 제한 없음 (무제한)';
    } else {
        el.textContent = '각 플레이어: ' + (gameSetting.minutes > 0 ? gameSetting.minutes + '분' : '0분') + ' | 추가 시간(수 당): ' + (gameSetting.increment > 0 ? gameSetting.increment + '초' : '없음');
    }
}

function startGame() {
    if (isOnlineMode()) {
        setLobbyOnlineMessage('온라인 모드에서는 방 만들기, 방 참가, 랜덤 매칭 버튼을 사용해주세요.');
        return;
    }
    gameSetting.whiteName = document.getElementById('white-name').value.trim() || '백 (White)';
    gameSetting.blackName = document.getElementById('black-name').value.trim() || '흑 (Black)';
    
    // ★ AI 모드일 때 이름 자동 설정
    if (gameSetting.mode === 'ai') {
        if (gameSetting.aiColor === 'white') {
            gameSetting.whiteName = '🤖 Stockfish (Lv.' + gameSetting.aiLevel + ')';
            gameSetting.blackName = document.getElementById('black-name').value.trim() || '플레이어';
        } else {
            gameSetting.blackName = '🤖 Stockfish (Lv.' + gameSetting.aiLevel + ')';
            gameSetting.whiteName = document.getElementById('white-name').value.trim() || '플레이어';
        }
        
        // 엔진 로딩
        var loadingEl = document.getElementById('engine-loading');
        loadingEl.classList.add('active');
        
        initEngine().then(function() {
            // Skill Level 재설정
            stockfishWorker.postMessage('setoption name Skill Level value ' + gameSetting.aiLevel);
            stockfishWorker.postMessage('ucinewgame');
            stockfishWorker.postMessage('isready');
            
            loadingEl.classList.remove('active');
            document.getElementById('lobby-screen').classList.remove('active');
            document.getElementById('game-screen').classList.add('active');
            initGame();
        }).catch(function(err) {
            loadingEl.classList.remove('active');
            alert('⚠️ Stockfish 엔진 로딩에 실패했습니다.\n\n같은 폴더에 stockfish-18-lite-single.js 와 stockfish-18-lite-single.wasm 파일이 있는지 확인해주세요.\n\n오류: ' + err.message);
        });
    } else {
        document.getElementById('lobby-screen').classList.remove('active');
        document.getElementById('game-screen').classList.add('active');
        initGame();
    }
}

function returnToLobbyMode(mode) {
    stopTimer(); gameOver = true;
    cleanupDragState();
    clearPremoveQueue();
    drawOfferBy = null;
    turnStartedAt = null;
    finalGameResult = '*';
    finalGameTermination = '';
    gameEndedAt = null;
    aiThinking = false;
    showAIThinking(false);
    if (stockfishWorker && gameSetting.mode === 'ai') {
        stockfishWorker.postMessage('stop');
        stockfishWorker.postMessage('quit');
        stockfishWorker.terminate();
        stockfishWorker = null;
        engineReady = false;
    }
    document.getElementById('gameover-modal').classList.remove('active');
    closeResignModal(true);
    closePGNModal();
    updatePGNActionButtons();
    document.getElementById('promotion-modal').classList.remove('active');
    document.getElementById('game-screen').classList.remove('active');
    document.getElementById('lobby-screen').classList.add('active');
    gameSetting.mode = mode || 'pvp';
    selectMode(gameSetting.mode);
}

function backToLobby() {
    if (isOnlineMode() && !gameOver && onlineState.roomData && onlineState.roomData.status === 'playing') {
        resignGame();
        return;
    }
    if (isOnlineMode()) {
        cancelOnlineWaiting();
        resetOnlineSessionState();
    }
    returnToLobbyMode('pvp');
    return;
    stopTimer(); gameOver = true;
    cleanupDragState();
    clearPremoveQueue();
    drawOfferBy = null;
    turnStartedAt = null;
    finalGameResult = '*';
    finalGameTermination = '';
    gameEndedAt = null;
    aiThinking = false;
    showAIThinking(false);
    // ★ 엔진 종료
    if (stockfishWorker && gameSetting.mode === 'ai') {
        stockfishWorker.postMessage('stop');
        stockfishWorker.postMessage('quit');
        stockfishWorker.terminate();
        stockfishWorker = null;
        engineReady = false;
    }
    document.getElementById('gameover-modal').classList.remove('active');
    closeResignModal(true);
    closePGNModal();
    updatePGNActionButtons();
    document.getElementById('promotion-modal').classList.remove('active');
    document.getElementById('game-screen').classList.remove('active');
    document.getElementById('lobby-screen').classList.add('active');
    gameSetting.mode = 'pvp';
    selectMode('pvp');
}

function getResigningColor() {
    if (isOnlineMode()) return onlineState.playerColor;
    if (gameSetting.mode === 'ai') return gameSetting.playerColor;
    return currentTurn;
}

function getWinnerNameByColor(color) {
    return color === 'white' ? gameSetting.whiteName : gameSetting.blackName;
}

function getResultByWinnerColor(color) {
    return color === 'white' ? '1-0' : '0-1';
}

function isDrawOfferAvailableMode() {
    return isOnlineMode();
}

function getLastMoverColor() {
    return moveHistory.length > 0 ? moveHistory[moveHistory.length - 1].color : null;
}

function getControlledPlayerColor() {
    if (isOnlineMode()) return onlineState.playerColor;
    if (gameSetting.mode === 'ai') return gameSetting.playerColor;
    return null;
}

function getDrawOfferActorColor() {
    return getControlledPlayerColor() || getLastMoverColor();
}

function getDrawAcceptActorColor() {
    return getControlledPlayerColor() || currentTurn;
}

function canColorOfferDraw(color) {
    if (!isDrawOfferAvailableMode() || gameOver || !color || drawOfferBy) return false;
    if (moveHistory.length === 0) return false;
    if (getLastMoverColor() !== color) return false;
    return currentTurn === opponentColor(color);
}

function canColorAcceptDraw(color) {
    if (!isDrawOfferAvailableMode() || gameOver || !color || !drawOfferBy) return false;
    return drawOfferBy !== color && currentTurn === color;
}

function updateDrawControls() {
    var offerBtn = document.getElementById('offer-draw-btn');
    var acceptBtn = document.getElementById('accept-draw-btn');
    var statusEl = document.getElementById('draw-status-text');
    if (!offerBtn || !acceptBtn) return;

    var showDrawControls = isDrawOfferAvailableMode();
    offerBtn.style.display = showDrawControls ? '' : 'none';
    acceptBtn.style.display = showDrawControls ? '' : 'none';
    if (!showDrawControls) return;

    var offerColor = getDrawOfferActorColor();
    var acceptColor = getDrawAcceptActorColor();
    var canOffer = canColorOfferDraw(offerColor);
    var canAccept = canColorAcceptDraw(acceptColor);

    offerBtn.disabled = !canOffer;
    acceptBtn.disabled = !canAccept;
    offerBtn.textContent = drawOfferBy ? '🤝 무승부 제안 중' : '🤝 무승부 제안';
    acceptBtn.textContent = '✅ 무승부 수락';

    if (!statusEl) return;

    if (gameOver) {
        statusEl.textContent = '';
        return;
    }
    if (!isDrawOfferAvailableMode()) {
        statusEl.textContent = 'AI 대국에서는 무승부 제안을 사용할 수 없습니다.';
        return;
    }
    if (drawOfferBy) {
        statusEl.textContent = getWinnerNameByColor(drawOfferBy) + '이 무승부를 제안했습니다. 수를 두면 자동으로 거절됩니다.';
        return;
    }
    if (moveHistory.length === 0) {
        statusEl.textContent = '한 수 이상 둔 뒤에 무승부를 제안할 수 있습니다.';
        return;
    }
    if (canOffer && offerColor) {
        statusEl.textContent = getWinnerNameByColor(offerColor) + '이 지금 무승부를 제안할 수 있습니다.';
        return;
    }
    statusEl.textContent = '';
}

function offerDraw() {
    if (gameOver) return;
    var offerColor = getDrawOfferActorColor();
    if (!canColorOfferDraw(offerColor)) return;
    drawOfferBy = offerColor;
    updateUI();
    if (isOnlineMode() && !onlineState.applyingRemoteState) syncOnlineGameState('draw-offer');
}

function finalizeAcceptedDraw() {
    cleanupDragState();
    clearPremoveQueue();
    drawOfferBy = null;
    turnStartedAt = null;
    aiThinking = false;
    showAIThinking(false);
    stopTimer();
    gameOver = true;
    setGameConclusion('1/2-1/2', '합의 무승부');
    renderBoard();
    updateUI();
    showResolvedGameOver();
}

function acceptDraw() {
    if (gameOver) return;
    var acceptColor = getDrawAcceptActorColor();
    if (!canColorAcceptDraw(acceptColor)) return;
    finalizeAcceptedDraw();
    if (isOnlineMode() && !onlineState.applyingRemoteState) syncOnlineGameState('finish');
}

function isLocalPvpMode() {
    return gameSetting.mode === 'pvp';
}

function updateEndGameButton() {
    var btn = document.getElementById('end-game-btn');
    if (!btn) return;
    btn.textContent = isLocalPvpMode() ? '🚪 종료' : '🏳️ 기권';
}

function updateGameOverModalButtons() {
    var restartBtn = document.getElementById('restart-game-btn');
    if (!restartBtn) return;
    restartBtn.style.display = isOnlineMode() ? 'none' : '';
}

function updateResignModalCopy() {
    var titleEl = document.getElementById('resign-modal-title');
    var messageEl = document.getElementById('resign-modal-message');
    var confirmBtn = document.getElementById('resign-confirm-btn');
    if (!titleEl || !messageEl || !confirmBtn) return;

    if (isLocalPvpMode()) {
        titleEl.textContent = '게임 종료';
        messageEl.textContent = '현재 로컬 PvP 게임을 종료하고 로비로 돌아갈까요?';
        if (!resignModalPending) confirmBtn.textContent = '종료하기';
        return;
    }

    titleEl.textContent = '기권 확인';
    messageEl.textContent = '확인을 누르기 전까지는 게임이 계속 진행됩니다. 정말 기권할까요?';
    if (!resignModalPending) confirmBtn.textContent = '기권하기';
}

function applyResignationOutcome(loserColor) {
    var winnerColor = opponentColor(loserColor);
    cleanupDragState();
    clearPremoveQueue();
    drawOfferBy = null;
    turnStartedAt = null;
    aiThinking = false;
    showAIThinking(false);
    stopTimer();
    gameOver = true;
    setGameConclusion(getResultByWinnerColor(winnerColor), '기권');
    renderBoard();
    updateUI();
    showResolvedGameOver();
}

function setResignModalError(message) {
    var errorEl = document.getElementById('resign-modal-error');
    if (!errorEl) return;
    errorEl.textContent = message || '';
    errorEl.classList.toggle('visible', !!message);
}

function syncResignModalButtons() {
    var cancelBtn = document.getElementById('resign-cancel-btn');
    var confirmBtn = document.getElementById('resign-confirm-btn');
    if (cancelBtn) cancelBtn.disabled = resignModalPending;
    if (confirmBtn) {
        confirmBtn.disabled = resignModalPending;
        if (resignModalPending) confirmBtn.textContent = '처리 중...';
    }
    updateResignModalCopy();
}

function openResignModal() {
    if (gameOver || resignModalPending) return;
    if (!isLocalPvpMode() && !getResigningColor()) return;
    setResignModalError('');
    syncResignModalButtons();
    document.getElementById('resign-modal').classList.add('active');
}

function closeResignModal(force) {
    if (resignModalPending && !force) return;
    resignModalPending = false;
    syncResignModalButtons();
    setResignModalError('');
    document.getElementById('resign-modal').classList.remove('active');
}

function resignGame() {
    openResignModal();
}

function confirmResignGame() {
    if (gameOver || resignModalPending) return;

    if (isLocalPvpMode()) {
        closeResignModal(true);
        backToLobby();
        return;
    }

    var loserColor = getResigningColor();
    if (!loserColor) {
        closeResignModal(true);
        return;
    }

    resignModalPending = true;
    setResignModalError('');
    syncResignModalButtons();

    if (gameSetting.mode === 'ai' && stockfishWorker) {
        stockfishWorker.postMessage('stop');
    }

    if (isOnlineMode()) {
        leaveOnlineRoom('기권').then(function() {
            closeResignModal(true);
            applyResignationOutcome(loserColor);
        }).catch(function(err) {
            resignModalPending = false;
            syncResignModalButtons();
            setResignModalError('기권 처리에 실패했습니다: ' + err.message);
        });
        return;
    }

    closeResignModal(true);
    applyResignationOutcome(loserColor);
}

// ============================================================
//  게임 엔진
// ============================================================
function isWhite(piece) { return piece && piece === piece.toUpperCase(); }
function isBlack(piece) { return piece && piece === piece.toLowerCase(); }
function pieceColor(piece) { if (!piece) return null; return isWhite(piece) ? 'white' : 'black'; }
function opponentColor(color) { return color === 'white' ? 'black' : 'white'; }
function inBounds(r, c) { return r >= 0 && r < 8 && c >= 0 && c < 8; }
function cloneBoard(b) { return normalizeBoard(b); }

function setGameConclusion(result, termination) {
    finalGameResult = result || '*';
    finalGameTermination = termination || '';
    gameEndedAt = new Date();
}

function cloneState() {
    return {
        board: cloneBoard(board), currentTurn: currentTurn,
        drawOfferBy: drawOfferBy,
        castlingRights: { K: castlingRights.K, Q: castlingRights.Q, k: castlingRights.k, q: castlingRights.q },
        enPassantTarget: enPassantTarget ? enPassantTarget.slice() : null,
        halfMoveClock: halfMoveClock, fullMoveNumber: fullMoveNumber,
        capturedByWhite: capturedByWhite.slice(), capturedByBlack: capturedByBlack.slice(),
        lastMoveFrom: lastMoveFrom ? lastMoveFrom.slice() : null,
        lastMoveTo: lastMoveTo ? lastMoveTo.slice() : null,
        whiteTime: whiteTime, blackTime: blackTime, firstMoveMade: firstMoveMade
    };
}

function restoreState(state) {
    board = cloneBoard(state.board); currentTurn = state.currentTurn;
    drawOfferBy = state.drawOfferBy === 'black' ? 'black' : (state.drawOfferBy === 'white' ? 'white' : null);
    castlingRights = { K: state.castlingRights.K, Q: state.castlingRights.Q, k: state.castlingRights.k, q: state.castlingRights.q };
    enPassantTarget = state.enPassantTarget ? state.enPassantTarget.slice() : null;
    halfMoveClock = state.halfMoveClock; fullMoveNumber = state.fullMoveNumber;
    capturedByWhite = state.capturedByWhite.slice(); capturedByBlack = state.capturedByBlack.slice();
    lastMoveFrom = state.lastMoveFrom ? state.lastMoveFrom.slice() : null;
    lastMoveTo = state.lastMoveTo ? state.lastMoveTo.slice() : null;
    whiteTime = state.whiteTime; blackTime = state.blackTime; firstMoveMade = state.firstMoveMade;
}

function findKing(b, color) {
    var king = color === 'white' ? 'K' : 'k';
    for (var r = 0; r < 8; r++) for (var c = 0; c < 8; c++) if (b[r][c] === king) return [r, c];
    return null;
}

function isSquareAttacked(b, row, col, byColor) {
    var knightOffsets = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
    var knight = byColor === 'white' ? 'N' : 'n';
    for (var i = 0; i < knightOffsets.length; i++) {
        var nr = row + knightOffsets[i][0], nc = col + knightOffsets[i][1];
        if (inBounds(nr, nc) && b[nr][nc] === knight) return true;
    }
    var rook = byColor === 'white' ? 'R' : 'r';
    var queen = byColor === 'white' ? 'Q' : 'q';
    var straightDirs = [[-1,0],[1,0],[0,-1],[0,1]];
    for (var d = 0; d < straightDirs.length; d++) {
        var dr = straightDirs[d][0], dc = straightDirs[d][1];
        var nr2 = row + dr, nc2 = col + dc;
        while (inBounds(nr2, nc2)) {
            if (b[nr2][nc2]) { if (b[nr2][nc2] === rook || b[nr2][nc2] === queen) return true; break; }
            nr2 += dr; nc2 += dc;
        }
    }
    var bishop = byColor === 'white' ? 'B' : 'b';
    var diagDirs = [[-1,-1],[-1,1],[1,-1],[1,1]];
    for (var d = 0; d < diagDirs.length; d++) {
        var dr = diagDirs[d][0], dc = diagDirs[d][1];
        var nr3 = row + dr, nc3 = col + dc;
        while (inBounds(nr3, nc3)) {
            if (b[nr3][nc3]) { if (b[nr3][nc3] === bishop || b[nr3][nc3] === queen) return true; break; }
            nr3 += dr; nc3 += dc;
        }
    }
    var pawnDir = byColor === 'white' ? 1 : -1;
    var pawn = byColor === 'white' ? 'P' : 'p';
    if (inBounds(row + pawnDir, col - 1) && b[row + pawnDir][col - 1] === pawn) return true;
    if (inBounds(row + pawnDir, col + 1) && b[row + pawnDir][col + 1] === pawn) return true;
    var king = byColor === 'white' ? 'K' : 'k';
    for (var dr = -1; dr <= 1; dr++) for (var dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        var nr4 = row + dr, nc4 = col + dc;
        if (inBounds(nr4, nc4) && b[nr4][nc4] === king) return true;
    }
    return false;
}

function isInCheck(b, color) {
    var kingPos = findKing(b, color);
    if (!kingPos) return false;
    return isSquareAttacked(b, kingPos[0], kingPos[1], opponentColor(color));
}

function pseudoLegalMoves(b, row, col, castling, epTarget) {
    var piece = b[row][col];
    if (!piece) return [];
    var color = pieceColor(piece);
    var moves = [];
    var type = piece.toUpperCase();

    function addMove(tr, tc) {
        var target = b[tr][tc];
        if (target && pieceColor(target) === color) return false;
        if (target && target.toUpperCase() === 'K') return false;
        moves.push([tr, tc]);
        return !target;
    }

    if (type === 'P') {
        var dir = color === 'white' ? -1 : 1;
        var startRow = color === 'white' ? 6 : 1;
        if (inBounds(row + dir, col) && !b[row + dir][col]) {
            moves.push([row + dir, col]);
            if (row === startRow && !b[row + 2 * dir][col]) moves.push([row + 2 * dir, col]);
        }
        [-1, 1].forEach(function(dc) {
            var nr = row + dir, nc = col + dc;
            if (inBounds(nr, nc)) {
                if (b[nr][nc] && pieceColor(b[nr][nc]) !== color && b[nr][nc].toUpperCase() !== 'K') moves.push([nr, nc]);
                if (epTarget && epTarget[0] === nr && epTarget[1] === nc) moves.push([nr, nc]);
            }
        });
    } else if (type === 'N') {
        [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(function(o) {
            var nr = row + o[0], nc = col + o[1];
            if (inBounds(nr, nc)) addMove(nr, nc);
        });
    } else if (type === 'B') {
        [[-1,-1],[-1,1],[1,-1],[1,1]].forEach(function(d) {
            var nr = row + d[0], nc = col + d[1];
            while (inBounds(nr, nc)) { if (!addMove(nr, nc)) break; nr += d[0]; nc += d[1]; }
        });
    } else if (type === 'R') {
        [[-1,0],[1,0],[0,-1],[0,1]].forEach(function(d) {
            var nr = row + d[0], nc = col + d[1];
            while (inBounds(nr, nc)) { if (!addMove(nr, nc)) break; nr += d[0]; nc += d[1]; }
        });
    } else if (type === 'Q') {
        [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]].forEach(function(d) {
            var nr = row + d[0], nc = col + d[1];
            while (inBounds(nr, nc)) { if (!addMove(nr, nc)) break; nr += d[0]; nc += d[1]; }
        });
    } else if (type === 'K') {
        for (var dr = -1; dr <= 1; dr++) for (var dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            var nr = row + dr, nc = col + dc;
            if (inBounds(nr, nc)) addMove(nr, nc);
        }
        if (color === 'white' && row === 7 && col === 4) {
            if (castling.K && b[7][5]==='' && b[7][6]==='' && b[7][7]==='R' && !isSquareAttacked(b,7,4,'black') && !isSquareAttacked(b,7,5,'black') && !isSquareAttacked(b,7,6,'black')) moves.push([7,6]);
            if (castling.Q && b[7][3]==='' && b[7][2]==='' && b[7][1]==='' && b[7][0]==='R' && !isSquareAttacked(b,7,4,'black') && !isSquareAttacked(b,7,3,'black') && !isSquareAttacked(b,7,2,'black')) moves.push([7,2]);
        }
        if (color === 'black' && row === 0 && col === 4) {
            if (castling.k && b[0][5]==='' && b[0][6]==='' && b[0][7]==='r' && !isSquareAttacked(b,0,4,'white') && !isSquareAttacked(b,0,5,'white') && !isSquareAttacked(b,0,6,'white')) moves.push([0,6]);
            if (castling.q && b[0][3]==='' && b[0][2]==='' && b[0][1]==='' && b[0][0]==='r' && !isSquareAttacked(b,0,4,'white') && !isSquareAttacked(b,0,3,'white') && !isSquareAttacked(b,0,2,'white')) moves.push([0,2]);
        }
    }
    return moves;
}

function legalMoves(row, col) {
    return legalMovesForState(createBoardStateSnapshot(), row, col);
}

function hasAnyLegalMoves(color) {
    for (var r = 0; r < 8; r++) for (var c = 0; c < 8; c++)
        if (board[r][c] && pieceColor(board[r][c]) === color && legalMoves(r, c).length > 0) return true;
    return false;
}

function isInsufficientMaterial() {
    var pieces = { white: [], black: [] };
    for (var r = 0; r < 8; r++) for (var c = 0; c < 8; c++) {
        var p = board[r][c];
        if (p) pieces[pieceColor(p)].push(p.toUpperCase());
    }
    var w = pieces.white.filter(function(p) { return p !== 'K'; });
    var b = pieces.black.filter(function(p) { return p !== 'K'; });
    if (w.length === 0 && b.length === 0) return true;
    if (w.length === 0 && b.length === 1 && (b[0] === 'B' || b[0] === 'N')) return true;
    if (b.length === 0 && w.length === 1 && (w[0] === 'B' || w[0] === 'N')) return true;
    return false;
}

function executeMove(fromRow, fromCol, toRow, toCol, promotionPiece, options) {
    cleanupDragState();
    boardHistory.push(cloneState());
    var piece = board[fromRow][fromCol];
    var color = pieceColor(piece);
    if (drawOfferBy && drawOfferBy !== color) drawOfferBy = null;
    var isWhiteFirstMove = !firstMoveMade && color === 'white';
    var moveOptions = options || {};
    var moveDurationMs = typeof moveOptions.forceDurationMs === 'number' ? moveOptions.forceDurationMs : (isWhiteFirstMove ? 0 : (turnStartedAt ? Math.max(0, Date.now() - turnStartedAt) : 0));
    var captured = board[toRow][toCol];
    var moveNotation = '';
    var isCapture = false;
    var isCastle = false;

    if (captured) {
        isCapture = true;
        if (color === 'white') capturedByWhite.push(captured); else capturedByBlack.push(captured);
    }
    if (piece.toUpperCase() === 'P' && enPassantTarget && toRow === enPassantTarget[0] && toCol === enPassantTarget[1]) {
        var capturedRow = color === 'white' ? toRow + 1 : toRow - 1;
        var epCaptured = board[capturedRow][toCol];
        if (color === 'white') capturedByWhite.push(epCaptured); else capturedByBlack.push(epCaptured);
        board[capturedRow][toCol] = '';
        isCapture = true;
    }
    if (piece.toUpperCase() === 'K' && Math.abs(toCol - fromCol) === 2) {
        isCastle = true;
        if (toCol === 6) { board[fromRow][5] = board[fromRow][7]; board[fromRow][7] = ''; moveNotation = 'O-O'; }
        else { board[fromRow][3] = board[fromRow][0]; board[fromRow][0] = ''; moveNotation = 'O-O-O'; }
    }
    board[toRow][toCol] = piece;
    board[fromRow][fromCol] = '';

    if (piece.toUpperCase() === 'P' && Math.abs(toRow - fromRow) === 2) enPassantTarget = [(fromRow + toRow) / 2, fromCol];
    else enPassantTarget = null;

    if (piece.toUpperCase() === 'P' && (toRow === 0 || toRow === 7)) {
        if (promotionPiece) board[toRow][toCol] = promotionPiece;
    }

    if (piece === 'K') { castlingRights.K = false; castlingRights.Q = false; }
    if (piece === 'k') { castlingRights.k = false; castlingRights.q = false; }
    if (piece === 'R' && fromRow === 7 && fromCol === 7) castlingRights.K = false;
    if (piece === 'R' && fromRow === 7 && fromCol === 0) castlingRights.Q = false;
    if (piece === 'r' && fromRow === 0 && fromCol === 7) castlingRights.k = false;
    if (piece === 'r' && fromRow === 0 && fromCol === 0) castlingRights.q = false;
    if (toRow === 7 && toCol === 7) castlingRights.K = false;
    if (toRow === 7 && toCol === 0) castlingRights.Q = false;
    if (toRow === 0 && toCol === 7) castlingRights.k = false;
    if (toRow === 0 && toCol === 0) castlingRights.q = false;

    if (!isCastle) {
        var files = 'abcdefgh', ranks = '87654321';
        var pType = piece.toUpperCase();
        if (pType === 'P') { moveNotation = (isCapture ? files[fromCol] + 'x' : '') + files[toCol] + ranks[toRow]; }
        else { moveNotation = pType + (isCapture ? 'x' : '') + files[toCol] + ranks[toRow]; }
        if (promotionPiece) moveNotation += '=' + promotionPiece.toUpperCase();
    }

    lastMoveFrom = [fromRow, fromCol]; lastMoveTo = [toRow, toCol];
    if (piece.toUpperCase() === 'P' || isCapture) halfMoveClock = 0; else halfMoveClock++;
    if (!gameSetting.unlimited && firstMoveMade && gameSetting.increment > 0) {
        if (color === 'white') whiteTime += gameSetting.increment; else blackTime += gameSetting.increment;
    }
    if (!firstMoveMade) firstMoveMade = true;
    var clockAfterMove = gameSetting.unlimited ? null : (color === 'white' ? whiteTime : blackTime);
    if (currentTurn === 'black') fullMoveNumber++;
    currentTurn = opponentColor(currentTurn);

    var inCheck = isInCheck(board, currentTurn);
    var hasLegal = hasAnyLegalMoves(currentTurn);
    if (inCheck) moveNotation += hasLegal ? '+' : '#';
    addMoveToHistory(moveNotation, color, moveDurationMs, clockAfterMove);

    if (!hasLegal) {
        drawOfferBy = null;
        gameOver = true; stopTimer();
        setGameConclusion(inCheck ? (color === 'white' ? '1-0' : '0-1') : '1/2-1/2', inCheck ? '체크메이트' : '스테일메이트');
        showResolvedGameOver();
    } else if (isInsufficientMaterial()) {
        drawOfferBy = null;
        setGameConclusion('1/2-1/2', '기물 부족');
        gameOver = true; stopTimer(); showResolvedGameOver();
    } else if (halfMoveClock >= 100) {
        drawOfferBy = null;
        setGameConclusion('1/2-1/2', '50수 규칙');
        gameOver = true; stopTimer(); showResolvedGameOver();
    }
    turnStartedAt = gameOver ? null : Date.now();
    if (!gameSetting.unlimited && !gameOver && !timerInterval) startTimer();
    if (!gameOver && tryExecutePremove()) return;
    renderBoard(); updateUI();

    if (isOnlineMode() && !onlineState.applyingRemoteState) {
        syncOnlineGameState(gameOver ? 'finish' : 'move');
        return;
    }
    
    // ★ AI 턴이면 AI에게 수 요청
    if (isAITurn()) {
        setTimeout(function() {
            requestAIMove();
        }, 300); // 약간의 딜레이로 자연스러운 느낌
    }
}

function formatDurationForDisplay(durationMs) {
    var seconds = Math.max(0, durationMs || 0) / 1000;
    if (seconds < 10) return seconds.toFixed(1) + 's';
    if (seconds < 60) return Math.round(seconds) + 's';
    var totalSeconds = Math.round(seconds);
    var minutes = Math.floor(totalSeconds / 60);
    var remain = totalSeconds % 60;
    return minutes + ':' + (remain < 10 ? '0' : '') + remain;
}

function formatDurationForPGN(durationMs) {
    var totalSeconds = Math.max(0, Math.round((durationMs || 0) / 1000));
    var hours = Math.floor(totalSeconds / 3600);
    var minutes = Math.floor((totalSeconds % 3600) / 60);
    var seconds = totalSeconds % 60;
    return hours + ':' + (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

function createMoveCellHtml(notation, durationMs) {
    return '<span class="move-notation">' + notation + '</span><span class="move-time">' + formatDurationForDisplay(durationMs) + '</span>';
}

function addMoveToHistory(notation, color, durationMs, clockAfterMove) {
    moveHistory.push({ notation: notation, color: color, durationMs: durationMs || 0, clockAfterMove: clockAfterMove });
    var moveList = document.getElementById('move-list');
    if (color === 'white') {
        var entry = document.createElement('div');
        entry.className = 'move-entry';
        entry.innerHTML = '<span class="move-number">' + fullMoveNumber + '.</span><span class="move-white">' + createMoveCellHtml(notation, durationMs) + '</span><span class="move-black"></span>';
        moveList.appendChild(entry);
    } else {
        var entries = moveList.querySelectorAll('.move-entry');
        var last = entries[entries.length - 1];
        if (last) last.querySelector('.move-black').innerHTML = createMoveCellHtml(notation, durationMs);
    }
    moveList.scrollTop = moveList.scrollHeight;
}

function renderBoard() {
    var chessboard = document.getElementById('chessboard');
    var premoveState = premoveQueue.length > 0 ? buildPremovePreviewState() : null;
    chessboard.oncontextmenu = function(e) {
        if (e && e.preventDefault) e.preventDefault();
        if (cancelPremove()) return false;
        return false;
    };
    chessboard.innerHTML = '';
    for (var r = 0; r < 8; r++) {
        for (var c = 0; c < 8; c++) {
            var displayR = isFlipped ? 7 - r : r;
            var displayC = isFlipped ? 7 - c : c;
            var square = document.createElement('div');
            square.className = 'square ' + ((displayR + displayC) % 2 === 0 ? 'light' : 'dark');
            square.dataset.row = displayR; square.dataset.col = displayC;

            if (lastMoveFrom && lastMoveFrom[0] === displayR && lastMoveFrom[1] === displayC) square.classList.add('last-move');
            if (lastMoveTo && lastMoveTo[0] === displayR && lastMoveTo[1] === displayC) square.classList.add('last-move');
            if (selectedSquare && selectedSquare[0] === displayR && selectedSquare[1] === displayC) square.classList.add('selected');
            if (premoveState) {
                for (var q = 0; q < premoveQueue.length; q++) {
                    if (premoveQueue[q].fromRow === displayR && premoveQueue[q].fromCol === displayC) square.classList.add('premove-from');
                    if (premoveQueue[q].toRow === displayR && premoveQueue[q].toCol === displayC) square.classList.add('premove-to');
                }
            }

            var isPossible = false;
            for (var m = 0; m < possibleMoves.length; m++) {
                if (possibleMoves[m][0] === displayR && possibleMoves[m][1] === displayC) { isPossible = true; break; }
            }
            if (isPossible) { if (board[displayR][displayC]) square.classList.add('capture-move'); else square.classList.add('possible-move'); }

            var piece = board[displayR][displayC];
            if (piece && piece.toUpperCase() === 'K' && isInCheck(board, pieceColor(piece))) square.classList.add('check');

            if (piece && PIECE_SVG[piece]) {
                var pieceDiv = document.createElement('div');
                pieceDiv.className = 'piece-svg';
                pieceDiv.innerHTML = PIECE_SVG[piece];
                if (canDragPiece(displayR, displayC)) {
                    pieceDiv.classList.add('draggable-piece');
                    pieceDiv.draggable = false;
                    (function(dr, dc, draggablePiece) {
                        draggablePiece.addEventListener('mousedown', function(e) {
                            startPointerDrag(dr, dc, draggablePiece, e);
                        });
                    })(displayR, displayC, pieceDiv);
                }
                square.appendChild(pieceDiv);
            }

            (function(dr, dc) { square.addEventListener('click', function() { onSquareClick(dr, dc); }); })(displayR, displayC);
            chessboard.appendChild(square);
        }
    }
    renderLabels();
}

function renderLabels() {
    var files = isFlipped ? 'hgfedcba' : 'abcdefgh';
    var ranks = isFlipped ? '12345678' : '87654321';
    ['rank-labels-top', 'rank-labels-bottom'].forEach(function(id) {
        var el = document.getElementById(id); el.innerHTML = '';
        for (var i = 0; i < files.length; i++) { var s = document.createElement('span'); s.textContent = files[i]; el.appendChild(s); }
    });
    ['file-labels-left', 'file-labels-right'].forEach(function(id) {
        var el = document.getElementById(id); el.innerHTML = '';
        for (var i = 0; i < ranks.length; i++) { var s = document.createElement('span'); s.textContent = ranks[i]; el.appendChild(s); }
    });
}

function onSquareClick(row, col) {
    if (gameOver) return;
    // ★ AI 턴이면 클릭 무시
    if (isAITurn() || aiThinking) return;
    
    if (selectedSquare) {
        if (isLegalDestination(row, col, possibleMoves)) {
            var movingPiece = board[selectedSquare[0]][selectedSquare[1]];
            if (movingPiece.toUpperCase() === 'P' && (row === 0 || row === 7)) {
                showPromotionModal(selectedSquare[0], selectedSquare[1], row, col);
            } else {
                executeMove(selectedSquare[0], selectedSquare[1], row, col, null);
            }
            selectedSquare = null; possibleMoves = []; return;
        }
    }
    if (canControlPiece(row, col)) {
        // ★ AI 모드에서는 자기 기물만 선택 가능
        selectedSquare = [row, col]; possibleMoves = legalMoves(row, col);
    } else { selectedSquare = null; possibleMoves = []; }
    renderBoard();
}

function showPromotionModal(fromRow, fromCol, toRow, toCol) {
    var modal = document.getElementById('promotion-modal');
    var choices = document.getElementById('promotion-choices');
    var color = currentTurn;
    var pieces = color === 'white' ? ['Q','R','B','N'] : ['q','r','b','n'];
    choices.innerHTML = '';
    pieces.forEach(function(p) {
        var btn = document.createElement('div');
        btn.className = 'promo-btn';
        var svgWrapper = document.createElement('div');
        svgWrapper.className = 'promo-svg';
        svgWrapper.innerHTML = PIECE_SVG[p];
        btn.appendChild(svgWrapper);
        btn.addEventListener('click', function() {
            modal.classList.remove('active');
            executeMove(fromRow, fromCol, toRow, toCol, p);
            selectedSquare = null; possibleMoves = [];
        });
        choices.appendChild(btn);
    });
    modal.classList.add('active');
}

function showGameOver(title, message) {
    if (!gameEndedAt) gameEndedAt = new Date();
    closeResignModal(true);
    document.getElementById('gameover-title').textContent = title;
    document.getElementById('gameover-message').textContent = message;
    updateGameOverModalButtons();
    updatePGNActionButtons();
    document.getElementById('gameover-modal').classList.add('active');
}

function updateUI() {
    var statusEl = document.getElementById('status');
    if (!gameOver) {
        var name = currentTurn === 'white' ? gameSetting.whiteName : gameSetting.blackName;
        var icon = currentTurn === 'white' ? '⚪' : '⚫';
        var checkText = isInCheck(board, currentTurn) ? ' ⚠️ 체크!' : '';
        statusEl.textContent = icon + ' ' + name + '의 차례' + checkText;
        statusEl.style.color = isInCheck(board, currentTurn) ? '#ff6b6b' : '';
    }
    document.getElementById('white-turn').className = 'turn-indicator' + (currentTurn === 'white' ? ' active' : '');
    document.getElementById('black-turn').className = 'turn-indicator' + (currentTurn === 'black' ? ' active' : '');

    var pieceOrder = { 'q':0,'r':1,'b':2,'n':3,'p':4,'Q':0,'R':1,'B':2,'N':3,'P':4 };
    var sortedWhite = capturedByWhite.slice().sort(function(a,b) { return pieceOrder[a]-pieceOrder[b]; });
    var sortedBlack = capturedByBlack.slice().sort(function(a,b) { return pieceOrder[a]-pieceOrder[b]; });

    var whiteCapturedEl = document.getElementById('white-captured');
    whiteCapturedEl.innerHTML = '';
    sortedWhite.forEach(function(p) {
        var mini = document.createElement('span'); mini.className = 'captured-piece-svg'; mini.innerHTML = PIECE_SVG[p]; whiteCapturedEl.appendChild(mini);
    });

    var blackCapturedEl = document.getElementById('black-captured');
    blackCapturedEl.innerHTML = '';
    sortedBlack.forEach(function(p) {
        var mini = document.createElement('span'); mini.className = 'captured-piece-svg'; mini.innerHTML = PIECE_SVG[p]; blackCapturedEl.appendChild(mini);
    });
    updateTimerDisplay();
    updateDrawControls();
}

function onSquareClick(row, col) {
    if (Date.now() < suppressBoardClickUntil) return;
    if (gameOver) return;
    var premoveState = buildPremovePreviewState();

    if (selectedSquare && isLegalDestination(row, col, possibleMoves)) {
        if (selectedPiece && selectedPiece.toUpperCase() === 'P' && (row === 0 || row === 7)) {
            showPromotionModal(selectedSquare[0], selectedSquare[1], row, col, selectedInteractionMode, selectedPiece);
        } else if (selectedInteractionMode === 'premove') {
            queuePremove(selectedSquare[0], selectedSquare[1], row, col, null);
        } else {
            executeMove(selectedSquare[0], selectedSquare[1], row, col, null);
        }
        return;
    }

    if (canControlPiece(row, col)) {
        setSelection(row, col, legalMoves(row, col), 'live', board[row][col]);
    } else if (canStartPremove(row, col, premoveState)) {
        setSelection(row, col, relaxedPremoveMovesForState(premoveState, row, col), 'premove', premoveState.board[row][col]);
    } else {
        cleanupDragState();
    }
    renderBoard();
}

function showPromotionModal(fromRow, fromCol, toRow, toCol, mode, movingPiece) {
    var modal = document.getElementById('promotion-modal');
    var choices = document.getElementById('promotion-choices');
    var actionMode = mode || 'live';
    var color = pieceColor(movingPiece || board[fromRow][fromCol]) || currentTurn;
    var pieces = color === 'white' ? ['Q','R','B','N'] : ['q','r','b','n'];
    choices.innerHTML = '';
    pieces.forEach(function(p) {
        var btn = document.createElement('div');
        btn.className = 'promo-btn';
        var svgWrapper = document.createElement('div');
        svgWrapper.className = 'promo-svg';
        svgWrapper.innerHTML = PIECE_SVG[p];
        btn.appendChild(svgWrapper);
        btn.addEventListener('click', function() {
            modal.classList.remove('active');
            if (actionMode === 'premove') queuePremove(fromRow, fromCol, toRow, toCol, p);
            else executeMove(fromRow, fromCol, toRow, toCol, p);
        });
        choices.appendChild(btn);
    });
    modal.classList.add('active');
}

/* function updateUI() {
    var statusEl = document.getElementById('status');
    if (!gameOver) {
        var name = currentTurn === 'white' ? gameSetting.whiteName : gameSetting.blackName;
        var icon = currentTurn === 'white' ? '?? : '??;
        var checkText = isInCheck(board, currentTurn) ? ' ?좑툘 泥댄겕!' : '';
        statusEl.textContent = icon + ' ' + name + '??李⑤?' + checkText;
        statusEl.style.color = isInCheck(board, currentTurn) ? '#ff6b6b' : '';
    }
    document.getElementById('white-turn').className = 'turn-indicator' + (currentTurn === 'white' ? ' active' : '');
    document.getElementById('black-turn').className = 'turn-indicator' + (currentTurn === 'black' ? ' active' : '');

    var pieceOrder = { 'q':0,'r':1,'b':2,'n':3,'p':4,'Q':0,'R':1,'B':2,'N':3,'P':4 };
    var sortedWhite = capturedByWhite.slice().sort(function(a,b) { return pieceOrder[a]-pieceOrder[b]; });
    var sortedBlack = capturedByBlack.slice().sort(function(a,b) { return pieceOrder[a]-pieceOrder[b]; });

    var whiteCapturedEl = document.getElementById('white-captured');
    whiteCapturedEl.innerHTML = '';
    sortedWhite.forEach(function(p) {
        var mini = document.createElement('span'); mini.className = 'captured-piece-svg'; mini.innerHTML = PIECE_SVG[p]; whiteCapturedEl.appendChild(mini);
    });

    var blackCapturedEl = document.getElementById('black-captured');
    blackCapturedEl.innerHTML = '';
    sortedBlack.forEach(function(p) {
        var mini = document.createElement('span'); mini.className = 'captured-piece-svg'; mini.innerHTML = PIECE_SVG[p]; blackCapturedEl.appendChild(mini);
    });
    updateTimerDisplay();
    updateDrawControls();
}
*/

function updateUI() {
    var statusEl = document.getElementById('status');
    if (!gameOver) {
        var name = currentTurn === 'white' ? gameSetting.whiteName : gameSetting.blackName;
        var icon = currentTurn === 'white' ? '⚪' : '⚫';
        var checkText = isInCheck(board, currentTurn) ? ' 체크!' : '';
        statusEl.textContent = icon + ' ' + name + ' 차례' + checkText;
        statusEl.style.color = isInCheck(board, currentTurn) ? '#ff6b6b' : '';
    }
    document.getElementById('white-turn').className = 'turn-indicator' + (currentTurn === 'white' ? ' active' : '');
    document.getElementById('black-turn').className = 'turn-indicator' + (currentTurn === 'black' ? ' active' : '');

    var pieceOrder = { 'q':0,'r':1,'b':2,'n':3,'p':4,'Q':0,'R':1,'B':2,'N':3,'P':4 };
    var sortedWhite = capturedByWhite.slice().sort(function(a,b) { return pieceOrder[a]-pieceOrder[b]; });
    var sortedBlack = capturedByBlack.slice().sort(function(a,b) { return pieceOrder[a]-pieceOrder[b]; });

    var whiteCapturedEl = document.getElementById('white-captured');
    whiteCapturedEl.innerHTML = '';
    sortedWhite.forEach(function(p) {
        var mini = document.createElement('span'); mini.className = 'captured-piece-svg'; mini.innerHTML = PIECE_SVG[p]; whiteCapturedEl.appendChild(mini);
    });

    var blackCapturedEl = document.getElementById('black-captured');
    blackCapturedEl.innerHTML = '';
    sortedBlack.forEach(function(p) {
        var mini = document.createElement('span'); mini.className = 'captured-piece-svg'; mini.innerHTML = PIECE_SVG[p]; blackCapturedEl.appendChild(mini);
    });
    updateTimerDisplay();
    updateDrawControls();
}

function formatTime(totalSeconds) {
    if (totalSeconds >= 3600) {
        var h = Math.floor(totalSeconds / 3600), m = Math.floor((totalSeconds % 3600) / 60), s = totalSeconds % 60;
        return h + ':' + (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
    }
    var m = Math.floor(totalSeconds / 60), s = totalSeconds % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
}

function escapePGNTagValue(value) {
    return String(value || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function formatPGNDate(date) {
    var safeDate = date || new Date();
    var year = safeDate.getFullYear();
    var month = String(safeDate.getMonth() + 1).padStart(2, '0');
    var day = String(safeDate.getDate()).padStart(2, '0');
    return year + '.' + month + '.' + day;
}

function formatTimeControlTag() {
    if (gameSetting.unlimited) return '-';
    if (!gameSetting.increment) return String(gameSetting.minutes * 60);
    return String(gameSetting.minutes * 60) + '+' + String(gameSetting.increment);
}

function formatPGNClockValue(totalSeconds) {
    var safeSeconds = Math.max(0, totalSeconds || 0);
    var wholeSeconds = Math.floor(safeSeconds);
    var hours = Math.floor(wholeSeconds / 3600);
    var minutes = Math.floor((wholeSeconds % 3600) / 60);
    var seconds = wholeSeconds % 60;
    var fraction = safeSeconds - wholeSeconds;
    var clock = hours + ':' + (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    if (fraction > 0) clock += String(fraction.toFixed(1)).slice(1);
    return clock;
}

function formatPGNTimestamp(durationMs) {
    return String(Math.max(0, Math.round((durationMs || 0) / 1000)));
}

function formatPGNEndTime(date) {
    var safeDate = date || new Date();
    var hours = safeDate.getHours();
    var minutes = String(safeDate.getMinutes()).padStart(2, '0');
    var seconds = String(safeDate.getSeconds()).padStart(2, '0');
    var offsetMinutes = -safeDate.getTimezoneOffset();
    var sign = offsetMinutes >= 0 ? '+' : '-';
    var absoluteOffset = Math.abs(offsetMinutes);
    var offsetHours = String(Math.floor(absoluteOffset / 60)).padStart(2, '0');
    var offsetRemain = String(absoluteOffset % 60).padStart(2, '0');
    return hours + ':' + minutes + ':' + seconds + ' GMT' + sign + offsetHours + offsetRemain;
}

function getPGNEventTag() {
    if (gameSetting.mode === 'ai') return 'Local Chess vs AI';
    return 'Local Chess';
}

function getPGNTerminationTag() {
    if (finalGameTermination) return finalGameTermination;
    if (finalGameResult === '*') return 'Unterminated';
    return 'Normal';
}

function buildPGN() {
    var startedAt = gameStartedAt || new Date();
    var endedAt = gameEndedAt || startedAt;
    var result = finalGameResult || '*';
    var tags = [
        ['Event', getPGNEventTag()],
        ['Site', 'Local'],
        ['Date', formatPGNDate(startedAt)],
        ['Round', '?'],
        ['White', gameSetting.whiteName || 'White'],
        ['Black', gameSetting.blackName || 'Black'],
        ['Result', result],
        ['TimeControl', formatTimeControlTag()],
        ['Termination', getPGNTerminationTag()],
        ['EndTime', formatPGNEndTime(endedAt)]
    ];

    var lines = tags.map(function(tag) {
        return '[' + tag[0] + ' "' + escapePGNTagValue(tag[1]) + '"]';
    });

    var moves = [];
    for (var i = 0; i < moveHistory.length; i++) {
        var move = moveHistory[i];
        if (move.color === 'white') {
            moves.push((Math.floor(i / 2) + 1) + '.');
        }

        var suffix = move.notation;
        var annotations = [];
        if (move.clockAfterMove !== null && move.clockAfterMove !== undefined) {
            annotations.push('[%clk ' + formatPGNClockValue(move.clockAfterMove) + ']');
        }
        if (typeof move.durationMs === 'number') {
            annotations.push('[%timestamp ' + formatPGNTimestamp(move.durationMs) + ']');
        }
        if (annotations.length > 0) suffix += ' {' + annotations.join('') + '}';
        moves.push(suffix);
    }
    moves.push(result);

    lines.push('');
    lines.push(moves.join(' '));
    return lines.join('\n');
}

function downloadTextFile(filename, content) {
    var blob = new Blob([content], { type: 'application/x-chess-pgn;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function savePGN() {
    if (moveHistory.length === 0) {
        alert('저장할 기보가 없습니다.');
        return;
    }

    var startedAt = gameStartedAt || new Date();
    var datePart = String(startedAt.getFullYear()) + String(startedAt.getMonth() + 1).padStart(2, '0') + String(startedAt.getDate()).padStart(2, '0');
    downloadTextFile('chess-' + datePart + '.pgn', buildPGN());
}

function getPGNFilename() {
    var startedAt = gameStartedAt || new Date();
    var datePart = String(startedAt.getFullYear()) + String(startedAt.getMonth() + 1).padStart(2, '0') + String(startedAt.getDate()).padStart(2, '0');
    return 'chess-' + datePart + '.pgn';
}

function hasPGNData() {
    return moveHistory.length > 0;
}

function updatePGNActionButtons() {
    var canUsePGN = gameOver && hasPGNData();
    var openBtn = document.getElementById('open-pgn-btn');
    var copyBtn = document.getElementById('copy-pgn-btn');
    var downloadBtn = document.getElementById('download-pgn-btn');
    if (openBtn) openBtn.disabled = !canUsePGN;
    if (copyBtn) copyBtn.disabled = !canUsePGN;
    if (downloadBtn) downloadBtn.disabled = !canUsePGN;
}

function closePGNModal() {
    var modal = document.getElementById('pgn-modal');
    if (modal) modal.classList.remove('active');
}

function openPGNModal() {
    if (moveHistory.length === 0) {
        alert('??ν븷 湲곕낫媛 ?놁뒿?덈떎.');
        return;
    }
    if (!gameOver) return;

    var textarea = document.getElementById('pgn-text');
    if (!textarea) return;
    textarea.value = buildPGN();
    updatePGNActionButtons();
    document.getElementById('pgn-modal').classList.add('active');
    textarea.scrollTop = 0;
    textarea.focus();
    textarea.select();
}

function downloadPGN() {
    if (!hasPGNData()) return;
    var textarea = document.getElementById('pgn-text');
    var pgnText = textarea && textarea.value ? textarea.value : buildPGN();
    downloadTextFile(getPGNFilename(), pgnText);
}

function copyPGN() {
    if (!hasPGNData()) return;
    var textarea = document.getElementById('pgn-text');
    if (!textarea) return;

    var text = textarea.value || buildPGN();
    textarea.value = text;
    textarea.focus();
    textarea.select();

    function notifyCopied() {
        alert('PGN이 클립보드에 복사되었습니다.');
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(notifyCopied).catch(function() {
            document.execCommand('copy');
            notifyCopied();
        });
        return;
    }

    document.execCommand('copy');
    notifyCopied();
}

/* function updateTimerDisplay() {
    var wEl = document.getElementById('white-timer'), bEl = document.getElementById('black-timer');
    if (gameSetting.unlimited) {
        wEl.textContent = '∞'; bEl.textContent = '∞';
        wEl.classList.add('no-limit'); bEl.classList.add('no-limit');
        wEl.classList.remove('low-time'); bEl.classList.remove('low-time');
    } else {
        wEl.textContent = formatTime(whiteTime); bEl.textContent = formatTime(blackTime);
        wEl.classList.remove('no-limit'); bEl.classList.remove('no-limit');
        if (whiteTime <= 30 && whiteTime > 0) wEl.classList.add('low-time'); else wEl.classList.remove('low-time');
        if (blackTime <= 30 && blackTime > 0) bEl.classList.add('low-time'); else bEl.classList.remove('low-time');
    }
}

function startTimer() {
    stopTimer();
    if (gameSetting.unlimited) return;
    timerInterval = setInterval(function() {
        if (gameOver) { stopTimer(); return; }
        if (currentTurn === 'white') {
            whiteTime--;
            if (whiteTime <= 0) drawOfferBy = null;
            if (whiteTime <= 0) { whiteTime = 0; gameOver = true; finalGameResult = '0-1'; turnStartedAt = null; stopTimer(); showGameOver('시간 초과! ⏰', gameSetting.blackName + '의 승리입니다!'); renderBoard(); }
        } else {
            blackTime--;
            if (blackTime <= 0) drawOfferBy = null;
            if (blackTime <= 0) drawOfferBy = null;
            if (blackTime <= 0) { blackTime = 0; gameOver = true; finalGameResult = '1-0'; turnStartedAt = null; stopTimer(); showGameOver('시간 초과! ⏰', gameSetting.whiteName + '의 승리입니다!'); renderBoard(); }
        }
        updateTimerDisplay();
    }, 1000);
}

}
*/

function updateTimerDisplay() {
    var wEl = document.getElementById('white-timer'), bEl = document.getElementById('black-timer');
    if (gameSetting.unlimited) {
        wEl.textContent = '∞'; bEl.textContent = '∞';
        wEl.classList.add('no-limit'); bEl.classList.add('no-limit');
        wEl.classList.remove('low-time'); bEl.classList.remove('low-time');
    } else {
        wEl.textContent = formatTime(whiteTime); bEl.textContent = formatTime(blackTime);
        wEl.classList.remove('no-limit'); bEl.classList.remove('no-limit');
        if (whiteTime <= 30 && whiteTime > 0) wEl.classList.add('low-time'); else wEl.classList.remove('low-time');
        if (blackTime <= 30 && blackTime > 0) bEl.classList.add('low-time'); else bEl.classList.remove('low-time');
    }
}

function startTimer() {
    stopTimer();
    if (gameSetting.unlimited) return;
    timerInterval = setInterval(function() {
        if (gameOver) { stopTimer(); return; }
        if (isOnlineMode() && !isLocalOnlineTurn()) return;
        if (currentTurn === 'white') {
            whiteTime--;
            if (whiteTime <= 0) drawOfferBy = null;
            if (whiteTime <= 0) { whiteTime = 0; gameOver = true; setGameConclusion('0-1', '시간 초과'); turnStartedAt = null; stopTimer(); showResolvedGameOver(); renderBoard(); }
        } else {
            blackTime--;
            if (blackTime <= 0) { blackTime = 0; gameOver = true; setGameConclusion('1-0', '시간 초과'); turnStartedAt = null; stopTimer(); showResolvedGameOver(); renderBoard(); }
        }
        updateTimerDisplay();
        if (isOnlineMode() && !onlineState.applyingRemoteState) syncOnlineGameState(gameOver ? 'finish' : 'tick');
    }, 1000);
}

function stopTimer() { if (timerInterval) { clearInterval(timerInterval); timerInterval = null; } }

// ★ 되돌리기: AI 모드에서는 AI 수까지 같이 되돌림 (2수)
function undoMove() {
    if (isOnlineMode()) {
        alert('온라인 대전에서는 되돌리기를 사용할 수 없습니다.');
        return;
    }
    if (boardHistory.length === 0) return;
    cleanupDragState();
    clearPremoveQueue();
    finalGameResult = '*';
    finalGameTermination = '';
    gameEndedAt = null;
    // ★ AI가 생각 중이면 중단
    if (aiThinking && stockfishWorker) {
        stockfishWorker.postMessage('stop');
        aiThinking = false;
        showAIThinking(false);
    }
    
    // AI 모드에서는 2수 되돌리기 (AI 수 + 내 수)
    var undoCount = (gameSetting.mode === 'ai' && boardHistory.length >= 2) ? 2 : 1;
    
    for (var i = 0; i < undoCount; i++) {
        if (boardHistory.length === 0) break;
        var prevState = boardHistory.pop();
        restoreState(prevState);
        if (moveHistory.length > 0) {
            var lastMove = moveHistory.pop();
            var moveList = document.getElementById('move-list');
            if (lastMove.color === 'white') { if (moveList.lastChild) moveList.removeChild(moveList.lastChild); }
            else { var entries = moveList.querySelectorAll('.move-entry'); var last = entries[entries.length - 1]; if (last) last.querySelector('.move-black').textContent = ''; }
        }
    }
    
    selectedSquare = null; possibleMoves = []; gameOver = false;
    turnStartedAt = Date.now();
    document.getElementById('gameover-modal').classList.remove('active');
    closeResignModal(true);
    closePGNModal();
    updatePGNActionButtons();
    if (!gameSetting.unlimited && firstMoveMade) startTimer();
    renderBoard(); updateUI();
}

function flipBoard() { isFlipped = !isFlipped; renderBoard(); }

function initGame() {
    cleanupDragState();
    clearPremoveQueue();
    drawOfferBy = null;
    gameStartedAt = new Date();
    turnStartedAt = Date.now();
    finalGameResult = '*';
    finalGameTermination = '';
    gameEndedAt = null;
    board = INITIAL_BOARD.map(function(row) { return row.slice(); });
    currentTurn = 'white'; selectedSquare = null; possibleMoves = [];
    moveHistory = []; boardHistory = [];
    castlingRights = { K: true, Q: true, k: true, q: true };
    enPassantTarget = null; halfMoveClock = 0; fullMoveNumber = 1;
    gameOver = false; capturedByWhite = []; capturedByBlack = [];
    lastMoveFrom = null; lastMoveTo = null; firstMoveMade = false;
    aiThinking = false;
    showAIThinking(false);

    if (gameSetting.unlimited) { whiteTime = 0; blackTime = 0; }
    else { whiteTime = gameSetting.minutes * 60; blackTime = gameSetting.minutes * 60; }

    syncDisplayedPlayerNames();
    updateEndGameButton();
    updateGameOverModalButtons();

    var wInc = document.getElementById('white-increment-badge'), bInc = document.getElementById('black-increment-badge');
    if (gameSetting.increment > 0) {
        wInc.textContent = '+' + gameSetting.increment + 's'; bInc.textContent = '+' + gameSetting.increment + 's';
        wInc.style.display = 'inline-block'; bInc.style.display = 'inline-block';
    } else { wInc.style.display = 'none'; bInc.style.display = 'none'; }

    document.getElementById('move-list').innerHTML = '';
    document.getElementById('gameover-modal').classList.remove('active');
    closeResignModal(true);
    closePGNModal();
    updatePGNActionButtons();
    document.getElementById('promotion-modal').classList.remove('active');
    stopTimer();
    
    // ★ AI 모드: 플레이어가 흑이면 보드 뒤집기
    if (gameSetting.mode === 'ai' && gameSetting.playerColor === 'black') {
        isFlipped = true;
    } else {
        isFlipped = false;
    }
    
    renderBoard(); updateUI();
    
    // ★ AI가 백(선공)이면 바로 AI 수 요청
    if (gameSetting.mode === 'ai' && gameSetting.aiColor === 'white') {
        setTimeout(function() {
            if (stockfishWorker) {
                stockfishWorker.postMessage('ucinewgame');
                stockfishWorker.postMessage('isready');
            }
            setTimeout(function() {
                requestAIMove();
            }, 200);
        }, 500);
    } else if (gameSetting.mode === 'ai' && stockfishWorker) {
        stockfishWorker.postMessage('ucinewgame');
    }
}

function restartGame() {
    if (gameSetting.mode === 'ai') {
        returnToLobbyMode('ai');
        return;
    }
    if (isOnlineMode()) {
        alert('온라인 대전에서는 재시작 대신 새 방을 만들거나 다시 매칭해주세요.');
        return;
    }
    document.getElementById('gameover-modal').classList.remove('active');
    closeResignModal(true);
    closePGNModal();
    updatePGNActionButtons();
    cleanupDragState();
    clearPremoveQueue();
    drawOfferBy = null;
    finalGameResult = '*';
    finalGameTermination = '';
    gameEndedAt = null;
    if (gameSetting.mode === 'ai' && stockfishWorker) {
        stockfishWorker.postMessage('stop');
        stockfishWorker.postMessage('ucinewgame');
    }
    initGame();
}

window.addEventListener('DOMContentLoaded', function() {
    updateTimeSummary();
    updateAILevelUI();
    updatePGNActionButtons();
    updateEndGameButton();
    updateGameOverModalButtons();
    updateModeSelectionUI();
    document.addEventListener('mousemove', function(e) {
        handlePointerDragMove(e);
    });
    document.addEventListener('mouseup', function(e) {
        endPointerDragFromPoint(e.clientX, e.clientY, true);
    });
    window.addEventListener('blur', function() {
        endPointerDragFromPoint(-1, -1, false);
    });
    var onlineNameInput = document.getElementById('online-name');
    if (onlineNameInput) {
        onlineNameInput.addEventListener('input', function() {
            updateOnlineUI();
        });
    }
    ensureFirebaseReady().then(function() {
        setLobbyOnlineMessage('온라인 PvP를 선택한 뒤 닉네임을 입력하면 바로 사용할 수 있습니다.');
    }).catch(function() {});
    updateOnlineUI();
});
