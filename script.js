// ============================================================
//  ♟️ 체스 게임 엔진 (순수 JavaScript)
// ============================================================

// ── 기물 유니코드 ──
const PIECES = {
    K: '♚', Q: '♛', R: '♜', B: '♝', N: '♞', P: '♟',
    k: '♔', q: '♕', r: '♖', b: '♗', n: '♘', p: '♙'
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

// ── 게임 설정 (로비에서 결정) ──
let gameSetting = {
    mode: 'pvp',
    minutes: 5,
    increment: 0,
    whiteName: '백 (White)',
    blackName: '흑 (Black)',
    unlimited: false
};

// ── 게임 상태 ──
let board = [];
let currentTurn = 'white';
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
let firstMoveMade = false;

// ============================================================
//  로비 (시작 화면) 로직
// ============================================================

function selectMode(mode) {
    if (mode !== 'pvp') return;
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.mode-btn[data-mode="' + mode + '"]').classList.add('active');
    gameSetting.mode = mode;
}

function applyPreset(minutes, increment, el) {
    // 프리셋 버튼 활성화
    document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));
    if (el) el.classList.add('active');

    // 입력 필드 업데이트
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

    // 프리셋 버튼 매칭 해제
    document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));

    // 매칭되는 프리셋 찾기
    var presets = document.querySelectorAll('.preset-btn');
    presets.forEach(function(btn) {
        var m = btn.getAttribute('data-minutes');
        var i = btn.getAttribute('data-increment');
        if (m !== null && parseInt(m) === minutes && parseInt(i) === increment) {
            btn.classList.add('active');
        }
    });

    updateTimeSummary();
}

function updateTimeSummary() {
    var el = document.getElementById('time-summary-text');
    if (gameSetting.unlimited) {
        el.textContent = '⏱️ 시간 제한 없음 (무제한)';
    } else {
        var timeStr = gameSetting.minutes > 0 ? gameSetting.minutes + '분' : '0분';
        var incStr = gameSetting.increment > 0 ? gameSetting.increment + '초' : '없음';
        el.textContent = '⏱️ 각 플레이어: ' + timeStr + ' | 추가 시간(수 당): ' + incStr;
    }
}

function startGame() {
    var whiteName = document.getElementById('white-name').value.trim() || '백 (White)';
    var blackName = document.getElementById('black-name').value.trim() || '흑 (Black)';
    gameSetting.whiteName = whiteName;
    gameSetting.blackName = blackName;

    document.getElementById('lobby-screen').classList.remove('active');
    document.getElementById('game-screen').classList.add('active');

    initGame();
}

function backToLobby() {
    stopTimer();
    gameOver = true;

    document.getElementById('gameover-modal').classList.remove('active');
    document.getElementById('promotion-modal').classList.remove('active');

    document.getElementById('game-screen').classList.remove('active');
    document.getElementById('lobby-screen').classList.add('active');
}

// ============================================================
//  게임 엔진
// ============================================================

function isWhite(piece) { return piece && piece === piece.toUpperCase(); }
function isBlack(piece) { return piece && piece === piece.toLowerCase(); }
function pieceColor(piece) {
    if (!piece) return null;
    return isWhite(piece) ? 'white' : 'black';
}
function opponentColor(color) { return color === 'white' ? 'black' : 'white'; }
function inBounds(r, c) { return r >= 0 && r < 8 && c >= 0 && c < 8; }
function cloneBoard(b) { return b.map(function(row) { return row.slice(); }); }

function cloneState() {
    return {
        board: cloneBoard(board),
        currentTurn: currentTurn,
        castlingRights: { K: castlingRights.K, Q: castlingRights.Q, k: castlingRights.k, q: castlingRights.q },
        enPassantTarget: enPassantTarget ? enPassantTarget.slice() : null,
        halfMoveClock: halfMoveClock,
        fullMoveNumber: fullMoveNumber,
        capturedByWhite: capturedByWhite.slice(),
        capturedByBlack: capturedByBlack.slice(),
        lastMoveFrom: lastMoveFrom ? lastMoveFrom.slice() : null,
        lastMoveTo: lastMoveTo ? lastMoveTo.slice() : null,
        whiteTime: whiteTime,
        blackTime: blackTime,
        firstMoveMade: firstMoveMade
    };
}

function restoreState(state) {
    board = cloneBoard(state.board);
    currentTurn = state.currentTurn;
    castlingRights = { K: state.castlingRights.K, Q: state.castlingRights.Q, k: state.castlingRights.k, q: state.castlingRights.q };
    enPassantTarget = state.enPassantTarget ? state.enPassantTarget.slice() : null;
    halfMoveClock = state.halfMoveClock;
    fullMoveNumber = state.fullMoveNumber;
    capturedByWhite = state.capturedByWhite.slice();
    capturedByBlack = state.capturedByBlack.slice();
    lastMoveFrom = state.lastMoveFrom ? state.lastMoveFrom.slice() : null;
    lastMoveTo = state.lastMoveTo ? state.lastMoveTo.slice() : null;
    whiteTime = state.whiteTime;
    blackTime = state.blackTime;
    firstMoveMade = state.firstMoveMade;
}

function findKing(b, color) {
    var king = color === 'white' ? 'K' : 'k';
    for (var r = 0; r < 8; r++)
        for (var c = 0; c < 8; c++)
            if (b[r][c] === king) return [r, c];
    return null;
}

function isSquareAttacked(b, row, col, byColor) {
    var knightMoves = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
    var knight = byColor === 'white' ? 'N' : 'n';
    for (var i = 0; i < knightMoves.length; i++) {
        var nr = row + knightMoves[i][0], nc = col + knightMoves[i][1];
        if (inBounds(nr, nc) && b[nr][nc] === knight) return true;
    }

    var rook = byColor === 'white' ? 'R' : 'r';
    var queen = byColor === 'white' ? 'Q' : 'q';
    var straightDirs = [[-1,0],[1,0],[0,-1],[0,1]];
    for (var d = 0; d < straightDirs.length; d++) {
        var dr = straightDirs[d][0], dc = straightDirs[d][1];
        var nr = row + dr, nc = col + dc;
        while (inBounds(nr, nc)) {
            if (b[nr][nc]) {
                if (b[nr][nc] === rook || b[nr][nc] === queen) return true;
                break;
            }
            nr += dr; nc += dc;
        }
    }

    var bishop = byColor === 'white' ? 'B' : 'b';
    var diagDirs = [[-1,-1],[-1,1],[1,-1],[1,1]];
    for (var d = 0; d < diagDirs.length; d++) {
        var dr = diagDirs[d][0], dc = diagDirs[d][1];
        var nr = row + dr, nc = col + dc;
        while (inBounds(nr, nc)) {
            if (b[nr][nc]) {
                if (b[nr][nc] === bishop || b[nr][nc] === queen) return true;
                break;
            }
            nr += dr; nc += dc;
        }
    }

    var pawnDir = byColor === 'white' ? 1 : -1;
    var pawn = byColor === 'white' ? 'P' : 'p';
    if (inBounds(row + pawnDir, col - 1) && b[row + pawnDir][col - 1] === pawn) return true;
    if (inBounds(row + pawnDir, col + 1) && b[row + pawnDir][col + 1] === pawn) return true;

    var king = byColor === 'white' ? 'K' : 'k';
    for (var dr = -1; dr <= 1; dr++)
        for (var dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            var nr = row + dr, nc = col + dc;
            if (inBounds(nr, nc) && b[nr][nc] === king) return true;
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
        moves.push([tr, tc]);
        return !target;
    }

    if (type === 'P') {
        var dir = color === 'white' ? -1 : 1;
        var startRow = color === 'white' ? 6 : 1;
        if (inBounds(row + dir, col) && !b[row + dir][col]) {
            moves.push([row + dir, col]);
            if (row === startRow && !b[row + 2 * dir][col])
                moves.push([row + 2 * dir, col]);
        }
        var pawnCaptures = [-1, 1];
        for (var i = 0; i < pawnCaptures.length; i++) {
            var dc = pawnCaptures[i];
            var nr = row + dir, nc = col + dc;
            if (inBounds(nr, nc)) {
                if (b[nr][nc] && pieceColor(b[nr][nc]) !== color) moves.push([nr, nc]);
                if (epTarget && epTarget[0] === nr && epTarget[1] === nc) moves.push([nr, nc]);
            }
        }
    } else if (type === 'N') {
        var knightMoves = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
        for (var i = 0; i < knightMoves.length; i++) {
            var nr = row + knightMoves[i][0], nc = col + knightMoves[i][1];
            if (inBounds(nr, nc)) addMove(nr, nc);
        }
    } else if (type === 'B') {
        var dirs = [[-1,-1],[-1,1],[1,-1],[1,1]];
        for (var d = 0; d < dirs.length; d++) {
            var nr = row + dirs[d][0], nc = col + dirs[d][1];
            while (inBounds(nr, nc)) { if (!addMove(nr, nc)) break; nr += dirs[d][0]; nc += dirs[d][1]; }
        }
    } else if (type === 'R') {
        var dirs = [[-1,0],[1,0],[0,-1],[0,1]];
        for (var d = 0; d < dirs.length; d++) {
            var nr = row + dirs[d][0], nc = col + dirs[d][1];
            while (inBounds(nr, nc)) { if (!addMove(nr, nc)) break; nr += dirs[d][0]; nc += dirs[d][1]; }
        }
    } else if (type === 'Q') {
        var dirs = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
        for (var d = 0; d < dirs.length; d++) {
            var nr = row + dirs[d][0], nc = col + dirs[d][1];
            while (inBounds(nr, nc)) { if (!addMove(nr, nc)) break; nr += dirs[d][0]; nc += dirs[d][1]; }
        }
    } else if (type === 'K') {
        for (var dr = -1; dr <= 1; dr++)
            for (var dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                var nr = row + dr, nc = col + dc;
                if (inBounds(nr, nc)) addMove(nr, nc);
            }
        // 캐슬링
        if (color === 'white' && row === 7 && col === 4) {
            if (castling.K && b[7][5]==='' && b[7][6]==='' && b[7][7]==='R'
                && !isSquareAttacked(b,7,4,'black') && !isSquareAttacked(b,7,5,'black') && !isSquareAttacked(b,7,6,'black'))
                moves.push([7,6]);
            if (castling.Q && b[7][3]==='' && b[7][2]==='' && b[7][1]==='' && b[7][0]==='R'
                && !isSquareAttacked(b,7,4,'black') && !isSquareAttacked(b,7,3,'black') && !isSquareAttacked(b,7,2,'black'))
                moves.push([7,2]);
        }
        if (color === 'black' && row === 0 && col === 4) {
            if (castling.k && b[0][5]==='' && b[0][6]==='' && b[0][7]==='r'
                && !isSquareAttacked(b,0,4,'white') && !isSquareAttacked(b,0,5,'white') && !isSquareAttacked(b,0,6,'white'))
                moves.push([0,6]);
            if (castling.q && b[0][3]==='' && b[0][2]==='' && b[0][1]==='' && b[0][0]==='r'
                && !isSquareAttacked(b,0,4,'white') && !isSquareAttacked(b,0,3,'white') && !isSquareAttacked(b,0,2,'white'))
                moves.push([0,2]);
        }
    }

    return moves;
}

function legalMoves(row, col) {
    var piece = board[row][col];
    if (!piece) return [];
    var color = pieceColor(piece);
    var pseudo = pseudoLegalMoves(board, row, col, castlingRights, enPassantTarget);
    var legal = [];

    for (var i = 0; i < pseudo.length; i++) {
        var tr = pseudo[i][0], tc = pseudo[i][1];
        var testBoard = cloneBoard(board);

        // 앙파상 캡처
        if (piece.toUpperCase() === 'P' && enPassantTarget && tr === enPassantTarget[0] && tc === enPassantTarget[1]) {
            var capturedRow = color === 'white' ? tr + 1 : tr - 1;
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

function hasAnyLegalMoves(color) {
    for (var r = 0; r < 8; r++)
        for (var c = 0; c < 8; c++)
            if (board[r][c] && pieceColor(board[r][c]) === color && legalMoves(r, c).length > 0)
                return true;
    return false;
}

function isInsufficientMaterial() {
    var pieces = { white: [], black: [] };
    for (var r = 0; r < 8; r++)
        for (var c = 0; c < 8; c++) {
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

// ── 수 실행 ──
function executeMove(fromRow, fromCol, toRow, toCol, promotionPiece) {
    boardHistory.push(cloneState());

    var piece = board[fromRow][fromCol];
    var color = pieceColor(piece);
    var captured = board[toRow][toCol];
    var moveNotation = '';
    var isCapture = false;
    var isCastle = false;

    if (captured) {
        isCapture = true;
        if (color === 'white') capturedByWhite.push(captured);
        else capturedByBlack.push(captured);
    }

    // 앙파상
    if (piece.toUpperCase() === 'P' && enPassantTarget && toRow === enPassantTarget[0] && toCol === enPassantTarget[1]) {
        var capturedRow = color === 'white' ? toRow + 1 : toRow - 1;
        var epCaptured = board[capturedRow][toCol];
        if (color === 'white') capturedByWhite.push(epCaptured);
        else capturedByBlack.push(epCaptured);
        board[capturedRow][toCol] = '';
        isCapture = true;
    }

    // 캐슬링
    if (piece.toUpperCase() === 'K' && Math.abs(toCol - fromCol) === 2) {
        isCastle = true;
        if (toCol === 6) { board[fromRow][5] = board[fromRow][7]; board[fromRow][7] = ''; moveNotation = 'O-O'; }
        else { board[fromRow][3] = board[fromRow][0]; board[fromRow][0] = ''; moveNotation = 'O-O-O'; }
    }

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
        if (promotionPiece) board[toRow][toCol] = promotionPiece;
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

    // 기보 표기
    if (!isCastle) {
        var files = 'abcdefgh';
        var ranks = '87654321';
        var pType = piece.toUpperCase();
        if (pType === 'P') {
            moveNotation = isCapture ? files[fromCol] + 'x' : '';
            moveNotation += files[toCol] + ranks[toRow];
        } else {
            moveNotation = pType + (isCapture ? 'x' : '') + files[toCol] + ranks[toRow];
        }
        if (promotionPiece) moveNotation += '=' + promotionPiece.toUpperCase();
    }

    lastMoveFrom = [fromRow, fromCol];
    lastMoveTo = [toRow, toCol];

    if (piece.toUpperCase() === 'P' || isCapture) halfMoveClock = 0;
    else halfMoveClock++;

    // 인크리먼트 추가
    if (!gameSetting.unlimited && firstMoveMade && gameSetting.increment > 0) {
        if (color === 'white') whiteTime += gameSetting.increment;
        else blackTime += gameSetting.increment;
    }

    if (!firstMoveMade) firstMoveMade = true;

    if (currentTurn === 'black') fullMoveNumber++;
    currentTurn = opponentColor(currentTurn);

    var inCheck = isInCheck(board, currentTurn);
    var hasLegal = hasAnyLegalMoves(currentTurn);

    if (inCheck) moveNotation += hasLegal ? '+' : '#';

    addMoveToHistory(moveNotation, color);

    if (!hasLegal) {
        gameOver = true;
        stopTimer();
        if (inCheck) {
            var winner = color === 'white' ? gameSetting.whiteName : gameSetting.blackName;
            showGameOver('체크메이트! 🏆', winner + '의 승리입니다!');
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

    // 타이머 시작 (첫 수 이후)
    if (!gameSetting.unlimited && !gameOver && !timerInterval) {
        startTimer();
    }

    renderBoard();
    updateUI();
}

// ── 기보 표시 ──
function addMoveToHistory(notation, color) {
    moveHistory.push({ notation: notation, color: color });
    var moveList = document.getElementById('move-list');

    if (color === 'white') {
        var entry = document.createElement('div');
        entry.className = 'move-entry';
        entry.innerHTML = '<span class="move-number">' + fullMoveNumber + '.</span>' +
                           '<span class="move-white">' + notation + '</span>' +
                           '<span class="move-black"></span>';
        moveList.appendChild(entry);
    } else {
        var entries = moveList.querySelectorAll('.move-entry');
        var last = entries[entries.length - 1];
        if (last) last.querySelector('.move-black').textContent = notation;
    }
    moveList.scrollTop = moveList.scrollHeight;
}

// ── 보드 렌더링 ──
function renderBoard() {
    var chessboard = document.getElementById('chessboard');
    chessboard.innerHTML = '';

    for (var r = 0; r < 8; r++) {
        for (var c = 0; c < 8; c++) {
            var displayR = isFlipped ? 7 - r : r;
            var displayC = isFlipped ? 7 - c : c;

            var square = document.createElement('div');
            square.className = 'square ' + ((displayR + displayC) % 2 === 0 ? 'light' : 'dark');
            square.dataset.row = displayR;
            square.dataset.col = displayC;

            if (lastMoveFrom && lastMoveFrom[0] === displayR && lastMoveFrom[1] === displayC)
                square.classList.add('last-move');
            if (lastMoveTo && lastMoveTo[0] === displayR && lastMoveTo[1] === displayC)
                square.classList.add('last-move');

            if (selectedSquare && selectedSquare[0] === displayR && selectedSquare[1] === displayC)
                square.classList.add('selected');

            var isPossible = false;
            for (var m = 0; m < possibleMoves.length; m++) {
                if (possibleMoves[m][0] === displayR && possibleMoves[m][1] === displayC) {
                    isPossible = true;
                    break;
                }
            }
            if (isPossible) {
                if (board[displayR][displayC]) square.classList.add('capture-move');
                else square.classList.add('possible-move');
            }

            var piece = board[displayR][displayC];
            if (piece && piece.toUpperCase() === 'K' && isInCheck(board, pieceColor(piece)))
                square.classList.add('check');

            if (piece) square.textContent = PIECES[piece];

            (function(dr, dc) {
                square.addEventListener('click', function() { onSquareClick(dr, dc); });
            })(displayR, displayC);

            chessboard.appendChild(square);
        }
    }

    renderLabels();
}

function renderLabels() {
    var files = isFlipped ? 'hgfedcba' : 'abcdefgh';
    var ranks = isFlipped ? '12345678' : '87654321';

    var labelIds = ['rank-labels-top', 'rank-labels-bottom'];
    for (var l = 0; l < labelIds.length; l++) {
        var el = document.getElementById(labelIds[l]);
        el.innerHTML = '';
        for (var i = 0; i < files.length; i++) {
            var span = document.createElement('span');
            span.textContent = files[i];
            el.appendChild(span);
        }
    }

    var fileLabelIds = ['file-labels-left', 'file-labels-right'];
    for (var l = 0; l < fileLabelIds.length; l++) {
        var el = document.getElementById(fileLabelIds[l]);
        el.innerHTML = '';
        for (var i = 0; i < ranks.length; i++) {
            var span = document.createElement('span');
            span.textContent = ranks[i];
            el.appendChild(span);
        }
    }
}

// ── 클릭 핸들러 ──
function onSquareClick(row, col) {
    if (gameOver) return;

    var piece = board[row][col];

    if (selectedSquare) {
        var isMove = false;
        for (var m = 0; m < possibleMoves.length; m++) {
            if (possibleMoves[m][0] === row && possibleMoves[m][1] === col) {
                isMove = true;
                break;
            }
        }
        if (isMove) {
            var movingPiece = board[selectedSquare[0]][selectedSquare[1]];
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
    var modal = document.getElementById('promotion-modal');
    var choices = document.getElementById('promotion-choices');
    var color = currentTurn;
    var pieces = color === 'white' ? ['Q','R','B','N'] : ['q','r','b','n'];
    var icons = color === 'white' ? ['♕','♖','♗','♘'] : ['♛','♜','♝','♞'];

    choices.innerHTML = '';
    for (var i = 0; i < pieces.length; i++) {
        (function(p, icon) {
            var btn = document.createElement('div');
            btn.className = 'promo-btn';
            btn.textContent = icon;
            btn.addEventListener('click', function() {
                modal.classList.remove('active');
                executeMove(fromRow, fromCol, toRow, toCol, p);
                selectedSquare = null;
                possibleMoves = [];
            });
            choices.appendChild(btn);
        })(pieces[i], icons[i]);
    }

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

    document.getElementById('white-captured').textContent = sortedWhite.map(function(p) { return PIECES[p]; }).join('');
    document.getElementById('black-captured').textContent = sortedBlack.map(function(p) { return PIECES[p]; }).join('');

    updateTimerDisplay();
}

// ── 타이머 ──
function formatTime(totalSeconds) {
    if (totalSeconds >= 3600) {
        var h = Math.floor(totalSeconds / 3600);
        var m = Math.floor((totalSeconds % 3600) / 60);
        var s = totalSeconds % 60;
        return h + ':' + (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
    }
    var m = Math.floor(totalSeconds / 60);
    var s = totalSeconds % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
}

function updateTimerDisplay() {
    var whiteTimerEl = document.getElementById('white-timer');
    var blackTimerEl = document.getElementById('black-timer');

    if (gameSetting.unlimited) {
        whiteTimerEl.textContent = '∞';
        blackTimerEl.textContent = '∞';
        whiteTimerEl.classList.add('no-limit');
        blackTimerEl.classList.add('no-limit');
        whiteTimerEl.classList.remove('low-time');
        blackTimerEl.classList.remove('low-time');
    } else {
        whiteTimerEl.textContent = formatTime(whiteTime);
        blackTimerEl.textContent = formatTime(blackTime);
        whiteTimerEl.classList.remove('no-limit');
        blackTimerEl.classList.remove('no-limit');

        if (whiteTime <= 30 && whiteTime > 0) whiteTimerEl.classList.add('low-time');
        else whiteTimerEl.classList.remove('low-time');

        if (blackTime <= 30 && blackTime > 0) blackTimerEl.classList.add('low-time');
        else blackTimerEl.classList.remove('low-time');
    }
}

function startTimer() {
    stopTimer();
    if (gameSetting.unlimited) return;

    timerInterval = setInterval(function() {
        if (gameOver) { stopTimer(); return; }
        if (currentTurn === 'white') {
            whiteTime--;
            if (whiteTime <= 0) {
                whiteTime = 0;
                gameOver = true;
                stopTimer();
                showGameOver('시간 초과! ⏰', gameSetting.blackName + '의 승리입니다!');
                renderBoard();
            }
        } else {
            blackTime--;
            if (blackTime <= 0) {
                blackTime = 0;
                gameOver = true;
                stopTimer();
                showGameOver('시간 초과! ⏰', gameSetting.whiteName + '의 승리입니다!');
                renderBoard();
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
    var prevState = boardHistory.pop();
    restoreState(prevState);

    if (moveHistory.length > 0) {
        var lastMove = moveHistory.pop();
        var moveList = document.getElementById('move-list');
        if (lastMove.color === 'white') {
            if (moveList.lastChild) moveList.removeChild(moveList.lastChild);
        } else {
            var entries = moveList.querySelectorAll('.move-entry');
            var last = entries[entries.length - 1];
            if (last) last.querySelector('.move-black').textContent = '';
        }
    }

    selectedSquare = null;
    possibleMoves = [];
    gameOver = false;
    document.getElementById('gameover-modal').classList.remove('active');

    if (!gameSetting.unlimited && firstMoveMade) startTimer();

    renderBoard();
    updateUI();
}

// ── 보드 뒤집기 ──
function flipBoard() {
    isFlipped = !isFlipped;
    renderBoard();
}

// ── 게임 초기화 ──
function initGame() {
    board = INITIAL_BOARD.map(function(row) { return row.slice(); });
    currentTurn = 'white';
    selectedSquare = null;
    possibleMoves = [];
    moveHistory = [];
    boardHistory = [];
    castlingRights = { K: true, Q: true, k: true, q: true };
    enPassantTarget = null;
    halfMoveClock = 0;
    fullMoveNumber = 1;
    gameOver = false;
    capturedByWhite = [];
    capturedByBlack = [];
    lastMoveFrom = null;
    lastMoveTo = null;
    firstMoveMade = false;

    if (gameSetting.unlimited) {
        whiteTime = 0;
        blackTime = 0;
    } else {
        whiteTime = gameSetting.minutes * 60;
        blackTime = gameSetting.minutes * 60;
    }

    document.getElementById('display-white-name').textContent = gameSetting.whiteName;
    document.getElementById('display-black-name').textContent = gameSetting.blackName;

    var whiteIncBadge = document.getElementById('white-increment-badge');
    var blackIncBadge = document.getElementById('black-increment-badge');
    if (gameSetting.increment > 0) {
        whiteIncBadge.textContent = '+' + gameSetting.increment + 's';
        blackIncBadge.textContent = '+' + gameSetting.increment + 's';
        whiteIncBadge.style.display = 'inline-block';
        blackIncBadge.style.display = 'inline-block';
    } else {
        whiteIncBadge.style.display = 'none';
        blackIncBadge.style.display = 'none';
    }

    document.getElementById('move-list').innerHTML = '';
    document.getElementById('gameover-modal').classList.remove('active');
    document.getElementById('promotion-modal').classList.remove('active');

    stopTimer();
    renderBoard();
    updateUI();
}

// ── 재시작 ──
function restartGame() {
    document.getElementById('gameover-modal').classList.remove('active');
    initGame();
}

// ── 페이지 로드 ──
window.addEventListener('DOMContentLoaded', function() {
    updateTimeSummary();
});
