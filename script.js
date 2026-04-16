// ============================================================
//  ♟️ 체스 게임 엔진 (순수 JavaScript)
// ============================================================

// ── 기물 유니코드 ──
const PIECES = {
    K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '♙',
    k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟'
};

// ── 초기 보드 배치 ──
const INITIAL_BOARD = [
    ['r','n','b','q','k','b','n','r'],
    ['p','p','p','p','p','p','p','p'],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['P','P','P','P','P','P','P','P'],
    ['R','N','B','Q','K','B','N','R']
];

// ── 게임 상태 ──
let board = [];
let currentTurn = 'white'; // 'white' | 'black'
let selectedSquare = null;
let possibleMoves = [];
let moveHistory = [];
let boardHistory = [];
let castlingRights = { K: true, Q: true, k: true, q: true };
let enPassantTarget = null;
let halfMoveClock = 0;
let fullMoveNumber = 1;
let whiteTime = 600;
let blackTime = 600;
let timerInterval = null;
let gameOver = false;
let isFlipped = false;
let capturedByWhite = [];
let capturedByBlack = [];
let lastMoveFrom = null;
let lastMoveTo = null;
let promotionCallback = null;

// ── 유틸리티 ──
function isWhite(piece) { return piece && piece === piece.toUpperCase(); }
function isBlack(piece) { return piece && piece === piece.toLowerCase(); }
function pieceColor(piece) {
    if (!piece) return null;
    return isWhite(piece) ? 'white' : 'black';
}
function opponentColor(color) { return color === 'white' ? 'black' : 'white'; }
function inBounds(r, c) { return r >= 0 && r < 8 && c >= 0 && c < 8; }

function cloneBoard(b) { return b.map(row => [...row]); }

function cloneState() {
    return {
        board: cloneBoard(board),
        currentTurn,
        castlingRights: { ...castlingRights },
        enPassantTarget: enPassantTarget ? [...enPassantTarget] : null,
        halfMoveClock,
        fullMoveNumber,
        capturedByWhite: [...capturedByWhite],
        capturedByBlack: [...capturedByBlack],
        lastMoveFrom: lastMoveFrom ? [...lastMoveFrom] : null,
        lastMoveTo: lastMoveTo ? [...lastMoveTo] : null,
        whiteTime,
        blackTime
    };
}

function restoreState(state) {
    board = cloneBoard(state.board);
    currentTurn = state.currentTurn;
    castlingRights = { ...state.castlingRights };
    enPassantTarget = state.enPassantTarget ? [...state.enPassantTarget] : null;
    halfMoveClock = state.halfMoveClock;
    fullMoveNumber = state.fullMoveNumber;
    capturedByWhite = [...state.capturedByWhite];
    capturedByBlack = [...state.capturedByBlack];
    lastMoveFrom = state.lastMoveFrom ? [...state.lastMoveFrom] : null;
    lastMoveTo = state.lastMoveTo ? [...state.lastMoveTo] : null;
    whiteTime = state.whiteTime;
    blackTime = state.blackTime;
}

// ── 킹 위치 찾기 ──
function findKing(b, color) {
    const king = color === 'white' ? 'K' : 'k';
    for (let r = 0; r < 8; r++)
        for (let c = 0; c < 8; c++)
            if (b[r][c] === king) return [r, c];
    return null;
}

// ── 특정 칸이 공격받는지 ──
function isSquareAttacked(b, row, col, byColor) {
    // 나이트 공격
    const knightMoves = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
    const knight = byColor === 'white' ? 'N' : 'n';
    for (const [dr, dc] of knightMoves) {
        const nr = row + dr, nc = col + dc;
        if (inBounds(nr, nc) && b[nr][nc] === knight) return true;
    }

    // 직선 공격 (룩, 퀸)
    const rook = byColor === 'white' ? 'R' : 'r';
    const queen = byColor === 'white' ? 'Q' : 'q';
    const straightDirs = [[-1,0],[1,0],[0,-1],[0,1]];
    for (const [dr, dc] of straightDirs) {
        let nr = row + dr, nc = col + dc;
        while (inBounds(nr, nc)) {
            if (b[nr][nc]) {
                if (b[nr][nc] === rook || b[nr][nc] === queen) return true;
                break;
            }
            nr += dr; nc += dc;
        }
    }

    // 대각선 공격 (비숍, 퀸)
    const bishop = byColor === 'white' ? 'B' : 'b';
    const diagDirs = [[-1,-1],[-1,1],[1,-1],[1,1]];
    for (const [dr, dc] of diagDirs) {
        let nr = row + dr, nc = col + dc;
        while (inBounds(nr, nc)) {
            if (b[nr][nc]) {
                if (b[nr][nc] === bishop || b[nr][nc] === queen) return true;
                break;
            }
            nr += dr; nc += dc;
        }
    }

    // 폰 공격
    const pawnDir = byColor === 'white' ? 1 : -1;
    const pawn = byColor === 'white' ? 'P' : 'p';
    if (inBounds(row + pawnDir, col - 1) && b[row + pawnDir][col - 1] === pawn) return true;
    if (inBounds(row + pawnDir, col + 1) && b[row + pawnDir][col + 1] === pawn) return true;

    // 킹 공격
    const king = byColor === 'white' ? 'K' : 'k';
    for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = row + dr, nc = col + dc;
            if (inBounds(nr, nc) && b[nr][nc] === king) return true;
        }

    return false;
}

function isInCheck(b, color) {
    const kingPos = findKing(b, color);
    if (!kingPos) return false;
    return isSquareAttacked(b, kingPos[0], kingPos[1], opponentColor(color));
}

// ── 의사 합법 수 생성 (체크 필터 전) ──
function pseudoLegalMoves(b, row, col, castling, epTarget) {
    const piece = b[row][col];
    if (!piece) return [];
    const color = pieceColor(piece);
    const moves = [];
    const type = piece.toUpperCase();

    function addMove(tr, tc) {
        const target = b[tr][tc];
        if (target && pieceColor(target) === color) return false;
        moves.push([tr, tc]);
        return !target; // true면 빈칸이라 계속 진행 가능
    }

    if (type === 'P') {
        const dir = color === 'white' ? -1 : 1;
        const startRow = color === 'white' ? 6 : 1;
        // 전진
        if (inBounds(row + dir, col) && !b[row + dir][col]) {
            moves.push([row + dir, col]);
            if (row === startRow && !b[row + 2 * dir][col])
                moves.push([row + 2 * dir, col]);
        }
        // 대각선 캡처
        for (const dc of [-1, 1]) {
            const nr = row + dir, nc = col + dc;
            if (inBounds(nr, nc)) {
                if (b[nr][nc] && pieceColor(b[nr][nc]) !== color)
                    moves.push([nr, nc]);
                // 앙파상
                if (epTarget && epTarget[0] === nr && epTarget[1] === nc)
                    moves.push([nr, nc]);
            }
        }
    } else if (type === 'N') {
        for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) {
            const nr = row + dr, nc = col + dc;
            if (inBounds(nr, nc)) addMove(nr, nc);
        }
    } else if (type === 'B') {
        for (const [dr, dc] of [[-1,-1],[-1,1],[1,-1],[1,1]]) {
            let nr = row + dr, nc = col + dc;
            while (inBounds(nr, nc)) {
                if (!addMove(nr, nc)) break;
                nr += dr; nc += dc;
            }
        }
    } else if (type === 'R') {
        for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
            let nr = row + dr, nc = col + dc;
            while (inBounds(nr, nc)) {
                if (!addMove(nr, nc)) break;
                nr += dr; nc += dc;
            }
        }
    } else if (type === 'Q') {
        for (const [dr, dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]) {
            let nr = row + dr, nc = col + dc;
            while (inBounds(nr, nc)) {
                if (!addMove(nr, nc)) break;
                nr += dr; nc += dc;
            }
        }
    } else if (type === 'K') {
        for (let dr = -1; dr <= 1; dr++)
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                const nr = row + dr, nc = col + dc;
                if (inBounds(nr, nc)) addMove(nr, nc);
            }
        // 캐슬링
        if (color === 'white' && row === 7 && col === 4) {
            // 킹사이드
            if (castling.K && b[7][5] === '' && b[7][6] === '' && b[7][7] === 'R'
                && !isSquareAttacked(b, 7, 4, 'black')
                && !isSquareAttacked(b, 7, 5, 'black')
                && !isSquareAttacked(b, 7, 6, 'black'))
                moves.push([7, 6]);
            // 퀸사이드
            if (castling.Q && b[7][3] === '' && b[7][2] === '' && b[7][1] === '' && b[7][0] === 'R'
                && !isSquareAttacked(b, 7, 4, 'black')
                && !isSquareAttacked(b, 7, 3, 'black')
                && !isSquareAttacked(b, 7, 2, 'black'))
                moves.push([7, 2]);
        }
        if (color === 'black' && row === 0 && col === 4) {
            if (castling.k && b[0][5] === '' && b[0][6] === '' && b[0][7] === 'r'
                && !isSquareAttacked(b, 0, 4, 'white')
                && !isSquareAttacked(b, 0, 5, 'white')
                && !isSquareAttacked(b, 0, 6, 'white'))
                moves.push([0, 6]);
            if (castling.q && b[0][3] === '' && b[0][2] === '' && b[0][1] === '' && b[0][0] === 'r'
                && !isSquareAttacked(b, 0, 4, 'white')
                && !isSquareAttacked(b, 0, 3, 'white')
                && !isSquareAttacked(b, 0, 2, 'white'))
                moves.push([0, 2]);
        }
    }

    return moves;
}

// ── 합법 수 (체크 필터 적용) ──
function legalMoves(row, col) {
    const piece = board[row][col];
    if (!piece) return [];
    const color = pieceColor(piece);
    const pseudo = pseudoLegalMoves(board, row, col, castlingRights, enPassantTarget);
    const legal = [];

    for (const [tr, tc] of pseudo) {
        const testBoard = cloneBoard(board);
        // 앙파상 처리
        if (piece.toUpperCase() === 'P' && enPassantTarget && tr === enPassantTarget[0] && tc === enPassantTarget[1]) {
            const capturedRow = color === 'white' ? tr + 1 : tr - 1;
            testBoard[capturedRow][tc] = '';
        }
        // 캐슬링 룩 이동
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

// ── 모든 합법 수 존재 여부 ──
function hasAnyLegalMoves(color) {
    for (let r = 0; r < 8; r++)
        for (let c = 0; c < 8; c++)
            if (board[r][c] && pieceColor(board[r][c]) === color && legalMoves(r, c).length > 0)
                return true;
    return false;
}

// ── 기물 부족 무승부 체크 ──
function isInsufficientMaterial() {
    const pieces = { white: [], black: [] };
    for (let r = 0; r < 8; r++)
        for (let c = 0; c < 8; c++) {
            const p = board[r][c];
            if (p) pieces[pieceColor(p)].push(p.toUpperCase());
        }
    const w = pieces.white.filter(p => p !== 'K');
    const b = pieces.black.filter(p => p !== 'K');
    if (w.length === 0 && b.length === 0) return true; // K vs K
    if (w.length === 0 && b.length === 1 && (b[0] === 'B' || b[0] === 'N')) return true;
    if (b.length === 0 && w.length === 1 && (w[0] === 'B' || w[0] === 'N')) return true;
    return false;
}

// ── 수 실행 ──
function executeMove(fromRow, fromCol, toRow, toCol, promotionPiece) {
    boardHistory.push(cloneState());

    const piece = board[fromRow][fromCol];
    const color = pieceColor(piece);
    const captured = board[toRow][toCol];
    let moveNotation = '';
    let isCapture = false;
    let isCastle = false;

    // 캡처 기록
    if (captured) {
        isCapture = true;
        if (color === 'white') capturedByWhite.push(captured);
        else capturedByBlack.push(captured);
    }

    // 앙파상 캡처
    if (piece.toUpperCase() === 'P' && enPassantTarget && toRow === enPassantTarget[0] && toCol === enPassantTarget[1]) {
        const capturedRow = color === 'white' ? toRow + 1 : toRow - 1;
        const epCaptured = board[capturedRow][toCol];
        if (color === 'white') capturedByWhite.push(epCaptured);
        else capturedByBlack.push(epCaptured);
        board[capturedRow][toCol] = '';
        isCapture = true;
    }

    // 캐슬링
    if (piece.toUpperCase() === 'K' && Math.abs(toCol - fromCol) === 2) {
        isCastle = true;
        if (toCol === 6) {
            board[fromRow][5] = board[fromRow][7];
            board[fromRow][7] = '';
            moveNotation = 'O-O';
        } else {
            board[fromRow][3] = board[fromRow][0];
            board[fromRow][0] = '';
            moveNotation = 'O-O-O';
        }
    }

    // 기물 이동
    board[toRow][toCol] = piece;
    board[fromRow][fromCol] = '';

    // 앙파상 타겟 설정
    if (piece.toUpperCase() === 'P' && Math.abs(toRow - fromRow) === 2) {
        enPassantTarget = [(fromRow + toRow) / 2, fromCol];
    } else {
        enPassantTarget = null;
    }

    // 프로모션
    if (piece.toUpperCase() === 'P' && (toRow === 0 || toRow === 7)) {
        if (promotionPiece) {
            board[toRow][toCol] = promotionPiece;
        }
    }

    // 캐슬링 권한 업데이트
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

    // 기보 표기법
    if (!isCastle) {
        const files = 'abcdefgh';
        const ranks = '87654321';
        const pType = piece.toUpperCase();
        if (pType === 'P') {
            moveNotation = isCapture ? files[fromCol] + 'x' : '';
            moveNotation += files[toCol] + ranks[toRow];
        } else {
            moveNotation = pType + (isCapture ? 'x' : '') + files[toCol] + ranks[toRow];
        }
        if (promotionPiece) moveNotation += '=' + promotionPiece.toUpperCase();
    }

    // 마지막 이동 기록
    lastMoveFrom = [fromRow, fromCol];
    lastMoveTo = [toRow, toCol];

    // 반수 시계
    if (piece.toUpperCase() === 'P' || isCapture) halfMoveClock = 0;
    else halfMoveClock++;

    // 턴 전환
    if (currentTurn === 'black') fullMoveNumber++;
    currentTurn = opponentColor(currentTurn);

    // 체크/체크메이트/스테일메이트 확인
    const inCheck = isInCheck(board, currentTurn);
    const hasLegal = hasAnyLegalMoves(currentTurn);

    if (inCheck) moveNotation += hasLegal ? '+' : '#';

    // 기보 추가
    addMoveToHistory(moveNotation, color);

    // 게임 종료 조건
    if (!hasLegal) {
        gameOver = true;
        stopTimer();
        if (inCheck) {
            const winner = color === 'white' ? '백' : '흑';
            showGameOver('체크메이트! 🏆', `${winner}의 승리입니다!`);
        } else {
            showGameOver('스테일메이트!', '무승부입니다.');
        }
    } else if (isInsufficientMaterial()) {
        gameOver = true;
        stopTimer();
        showGameOver('기물 부족!', '무승부입니다.');
    } else if (halfMoveClock >= 100) {
        gameOver = true;
        stopTimer();
        showGameOver('50수 규칙!', '무승부입니다.');
    }

    renderBoard();
    updateUI();
}

// ── 기보 표시 ──
function addMoveToHistory(notation, color) {
    moveHistory.push({ notation, color });
    const moveList = document.getElementById('move-list');

    if (color === 'white') {
        const entry = document.createElement('div');
        entry.className = 'move-entry';
        entry.innerHTML = `<span class="move-number">${fullMoveNumber}.</span>
                           <span class="move-white">${notation}</span>
                           <span class="move-black"></span>`;
        moveList.appendChild(entry);
    } else {
        const entries = moveList.querySelectorAll('.move-entry');
        const last = entries[entries.length - 1];
        if (last) last.querySelector('.move-black').textContent = notation;
    }
    moveList.scrollTop = moveList.scrollHeight;
}

// ── 보드 렌더링 ──
function renderBoard() {
    const chessboard = document.getElementById('chessboard');
    chessboard.innerHTML = '';

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const displayR = isFlipped ? 7 - r : r;
            const displayC = isFlipped ? 7 - c : c;

            const square = document.createElement('div');
            square.className = 'square ' + ((displayR + displayC) % 2 === 0 ? 'light' : 'dark');
            square.dataset.row = displayR;
            square.dataset.col = displayC;

            // 마지막 이동 하이라이트
            if (lastMoveFrom && lastMoveFrom[0] === displayR && lastMoveFrom[1] === displayC)
                square.classList.add('last-move');
            if (lastMoveTo && lastMoveTo[0] === displayR && lastMoveTo[1] === displayC)
                square.classList.add('last-move');

            // 선택된 칸
            if (selectedSquare && selectedSquare[0] === displayR && selectedSquare[1] === displayC)
                square.classList.add('selected');

            // 이동 가능 표시
            const isPossible = possibleMoves.some(m => m[0] === displayR && m[1] === displayC);
            if (isPossible) {
                if (board[displayR][displayC]) square.classList.add('capture-move');
                else square.classList.add('possible-move');
            }

            // 체크 표시
            const piece = board[displayR][displayC];
            if (piece && piece.toUpperCase() === 'K' && isInCheck(board, pieceColor(piece)))
                square.classList.add('check');

            // 기물 표시
            if (piece) square.textContent = PIECES[piece];

            square.addEventListener('click', () => onSquareClick(displayR, displayC));
            chessboard.appendChild(square);
        }
    }

    renderLabels();
}

function renderLabels() {
    const files = isFlipped ? 'hgfedcba' : 'abcdefgh';
    const ranks = isFlipped ? '12345678' : '87654321';

    ['rank-labels-top', 'rank-labels-bottom'].forEach(id => {
        const el = document.getElementById(id);
        el.innerHTML = '';
        for (const f of files) {
            const span = document.createElement('span');
            span.textContent = f;
            el.appendChild(span);
        }
    });

    ['file-labels-left', 'file-labels-right'].forEach(id => {
        const el = document.getElementById(id);
        el.innerHTML = '';
        for (const r of ranks) {
            const span = document.createElement('span');
            span.textContent = r;
            el.appendChild(span);
        }
    });
}

// ── 클릭 핸들러 ──
function onSquareClick(row, col) {
    if (gameOver) return;

    const piece = board[row][col];

    // 이미 선택된 기물이 있고, 이동 가능한 칸을 클릭한 경우
    if (selectedSquare) {
        const isMove = possibleMoves.some(m => m[0] === row && m[1] === col);
        if (isMove) {
            const movingPiece = board[selectedSquare[0]][selectedSquare[1]];
            // 프로모션 체크
            if (movingPiece.toUpperCase() === 'P' && (row === 0 || row === 7)) {
                showPromotionModal(selectedSquare[0], selectedSquare[1], row, col);
            } else {
                executeMove(selectedSquare[0], selectedSquare[1], row, col, null);
            }
            selectedSquare = null;
            possibleMoves = [];
            return;
        }
    }

    // 자기 기물 선택
    if (piece && pieceColor(piece) === currentTurn) {
        selectedSquare = [row, col];
        possibleMoves = legalMoves(row, col);
    } else {
        selectedSquare = null;
        possibleMoves = [];
    }

    renderBoard();
}

// ── 프로모션 모달 ──
function showPromotionModal(fromRow, fromCol, toRow, toCol) {
    const modal = document.getElementById('promotion-modal');
    const choices = document.getElementById('promotion-choices');
    const color = currentTurn;
    const pieces = color === 'white' ? ['Q','R','B','N'] : ['q','r','b','n'];
    const icons = color === 'white' ? ['♕','♖','♗','♘'] : ['♛','♜','♝','♞'];

    choices.innerHTML = '';
    pieces.forEach((p, i) => {
        const btn = document.createElement('div');
        btn.className = 'promo-btn';
        btn.textContent = icons[i];
        btn.addEventListener('click', () => {
            modal.classList.remove('active');
            executeMove(fromRow, fromCol, toRow, toCol, p);
            selectedSquare = null;
            possibleMoves = [];
        });
        choices.appendChild(btn);
    });

    modal.classList.add('active');
}

// ── 게임 종료 모달 ──
function showGameOver(title, message) {
    document.getElementById('gameover-title').textContent = title;
    document.getElementById('gameover-message').textContent = message;
    document.getElementById('gameover-modal').classList.add('active');
}

// ── UI 업데이트 ──
function updateUI() {
    // 턴 표시
    const statusEl = document.getElementById('status');
    if (!gameOver) {
        const turnText = currentTurn === 'white' ? '⚪ 백의 차례입니다' : '⚫ 흑의 차례입니다';
        const checkText = isInCheck(board, currentTurn) ? ' (체크!)' : '';
        statusEl.textContent = turnText + checkText;
        if (isInCheck(board, currentTurn)) statusEl.style.color = '#ff6b6b';
        else statusEl.style.color = '';
    }

    // 턴 인디케이터
    document.getElementById('white-turn').className = 'turn-indicator' + (currentTurn === 'white' ? ' active' : '');
    document.getElementById('black-turn').className = 'turn-indicator' + (currentTurn === 'black' ? ' active' : '');

    // 잡힌 기물
    const pieceOrder = { 'q': 0, 'r': 1, 'b': 2, 'n': 3, 'p': 4, 'Q': 0, 'R': 1, 'B': 2, 'N': 3, 'P': 4 };
    document.getElementById('white-captured').textContent =
        [...capturedByWhite].sort((a, b) => pieceOrder[a] - pieceOrder[b]).map(p => PIECES[p]).join('');
    document.getElementById('black-captured').textContent =
        [...capturedByBlack].sort((a, b) => pieceOrder[a] - pieceOrder[b]).map(p => PIECES[p]).join('');

    // 타이머
    updateTimerDisplay();
}

// ── 타이머 ──
function updateTimerDisplay() {
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };
    document.getElementById('white-timer').textContent = formatTime(whiteTime);
    document.getElementById('black-timer').textContent = formatTime(blackTime);
}

function startTimer() {
    stopTimer();
    timerInterval = setInterval(() => {
        if (gameOver) { stopTimer(); return; }
        if (currentTurn === 'white') {
            whiteTime--;
            if (whiteTime <= 0) {
                whiteTime = 0;
                gameOver = true;
                stopTimer();
                showGameOver('시간 초과! ⏰', '흑의 승리입니다!');
            }
        } else {
            blackTime--;
            if (blackTime <= 0) {
                blackTime = 0;
                gameOver = true;
                stopTimer();
                showGameOver('시간 초과! ⏰', '백의 승리입니다!');
            }
        }
        updateTimerDisplay();
    }, 1000);
}

function stopTimer() {
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
}

// ── 되돌리기 ──
function undoMove() {
    if (boardHistory.length === 0) return;
    const prevState = boardHistory.pop();
    restoreState(prevState);

    // 기보에서 마지막 수 제거
    if (moveHistory.length > 0) {
        const lastMove = moveHistory.pop();
        const moveList = document.getElementById('move-list');
        if (lastMove.color === 'white') {
            moveList.removeChild(moveList.lastChild);
        } else {
            const entries = moveList.querySelectorAll('.move-entry');
            const last = entries[entries.length - 1];
            if (last) last.querySelector('.move-black').textContent = '';
        }
    }

    selectedSquare = null;
    possibleMoves = [];
    gameOver = false;
    document.getElementById('gameover-modal').classList.remove('active');
    renderBoard();
    updateUI();
}

// ── 보드 뒤집기 ──
function flipBoard() {
    isFlipped = !isFlipped;
    renderBoard();
}

// ── 새 게임 ──
function newGame() {
    board = INITIAL_BOARD.map(row => [...row]);
    currentTurn = 'white';
    selectedSquare = null;
    possibleMoves = [];
    moveHistory = [];
    boardHistory = [];
    castlingRights = { K: true, Q: true, k: true, q: true };
    enPassantTarget = null;
    halfMoveClock = 0;
    fullMoveNumber = 1;
    whiteTime = 600;
    blackTime = 600;
    gameOver = false;
    capturedByWhite = [];
    capturedByBlack = [];
    lastMoveFrom = null;
    lastMoveTo = null;

    document.getElementById('move-list').innerHTML = '';
    document.getElementById('gameover-modal').classList.remove('active');
    document.getElementById('promotion-modal').classList.remove('active');

    stopTimer();
    startTimer();
    renderBoard();
    updateUI();
}

// ── 초기화 ──
window.addEventListener('DOMContentLoaded', () => {
    newGame();
});
