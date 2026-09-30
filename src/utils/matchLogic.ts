import { Gem, BoardTile, LevelConfig, GemColor, SpecialType } from '../types/game';

let idCounter = 1;
export const getNextId = () => `gem_${Date.now()}_${idCounter++}`;

export function createInitialGrid(level: LevelConfig): {
  gems: (Gem | null)[][];
  tiles: BoardTile[][];
} {
  const rows = level.rows;
  const cols = level.cols;
  const colors = level.colorPalette && level.colorPalette.length > 0 
    ? level.colorPalette 
    : ['ruby', 'sapphire', 'emerald', 'topaz', 'amethyst'] as GemColor[];

  // 1. Initialize board tiles (obstacles)
  const tiles: BoardTile[][] = [];
  for (let r = 0; r < rows; r++) {
    tiles[r] = [];
    for (let c = 0; c < cols; c++) {
      tiles[r][c] = {
        row: r,
        col: c,
        obstacle: 'none',
        hasRelicCollector: r === rows - 1
      };
    }
  }

  if (level.obstaclesLayout) {
    level.obstaclesLayout.forEach(obs => {
      if (tiles[obs.row] && tiles[obs.row][obs.col]) {
        tiles[obs.row][obs.col].obstacle = obs.type;
      }
    });
  }

  // 2. Initialize gems ensuring no initial 3-matches
  const gems: (Gem | null)[][] = [];
  for (let r = 0; r < rows; r++) {
    gems[r] = [];
    for (let c = 0; c < cols; c++) {
      let validColor: GemColor;
      do {
        validColor = colors[Math.floor(Math.random() * colors.length)];
      } while (
        (r >= 2 && gems[r - 1][c]?.color === validColor && gems[r - 2][c]?.color === validColor) ||
        (c >= 2 && gems[r][c - 1]?.color === validColor && gems[r][c - 2]?.color === validColor)
      );

      gems[r][c] = {
        id: getNextId(),
        color: validColor,
        special: 'none',
        row: r,
        col: c
      };
    }
  }

  // 3. Place initial relics if level specifies
  if (level.initialRelics) {
    level.initialRelics.forEach(rel => {
      if (gems[rel.row] && gems[rel.row][rel.col]) {
        gems[rel.row][rel.col] = {
          id: getNextId(),
          color: 'diamond', // relics use diamond placeholder or neutral
          special: 'relic',
          row: rel.row,
          col: rel.col
        };
      }
    });
  }

  return { gems, tiles };
}

export interface MatchResult {
  matches: { row: number; col: number }[];
  specialSpawn?: {
    row: number;
    col: number;
    color: GemColor;
    special: SpecialType;
  };
}

export function detectMatches(grid: (Gem | null)[][]): {
  allMatchedCoords: Set<string>;
  specialSpawns: { row: number; col: number; color: GemColor; special: SpecialType }[];
} {
  const rows = grid.length;
  const cols = grid[0].length;
  const allMatchedCoords = new Set<string>();
  const specialSpawns: { row: number; col: number; color: GemColor; special: SpecialType }[] = [];

  // Track match groups
  const hLines: { row: number; colStart: number; colEnd: number; color: GemColor }[] = [];
  const vLines: { col: number; rowStart: number; rowEnd: number; color: GemColor }[] = [];

  // 1. Horizontal scans
  for (let r = 0; r < rows; r++) {
    let matchLen = 1;
    for (let c = 0; c < cols; c++) {
      const current = grid[r][c];
      const next = c < cols - 1 ? grid[r][c + 1] : null;

      if (
        current &&
        next &&
        current.special !== 'relic' &&
        next.special !== 'relic' &&
        current.special !== 'singularity' &&
        next.special !== 'singularity' &&
        current.color === next.color
      ) {
        matchLen++;
      } else {
        if (matchLen >= 3 && current) {
          hLines.push({
            row: r,
            colStart: c - matchLen + 1,
            colEnd: c,
            color: current.color
          });
          for (let k = c - matchLen + 1; k <= c; k++) {
            allMatchedCoords.add(`${r},${k}`);
          }
        }
        matchLen = 1;
      }
    }
  }

  // 2. Vertical scans
  for (let c = 0; c < cols; c++) {
    let matchLen = 1;
    for (let r = 0; r < rows; r++) {
      const current = grid[r][c];
      const next = r < rows - 1 ? grid[r + 1][c] : null;

      if (
        current &&
        next &&
        current.special !== 'relic' &&
        next.special !== 'relic' &&
        current.special !== 'singularity' &&
        next.special !== 'singularity' &&
        current.color === next.color
      ) {
        matchLen++;
      } else {
        if (matchLen >= 3 && current) {
          vLines.push({
            col: c,
            rowStart: r - matchLen + 1,
            rowEnd: r,
            color: current.color
          });
          for (let k = r - matchLen + 1; k <= r; k++) {
            allMatchedCoords.add(`${k},${c}`);
          }
        }
        matchLen = 1;
      }
    }
  }

  // 3. Detect special shapes (Singularity 5-in-a-row, T/L Bombs, 4-in-a-row Beams)
  // Check horizontal 5+ or 4
  const usedCoordsForSpecial = new Set<string>();

  // Check L and T intersections first for Bombs
  for (const h of hLines) {
    for (const v of vLines) {
      if (h.color === v.color && v.col >= h.colStart && v.col <= h.colEnd && h.row >= v.rowStart && h.row <= v.rowEnd) {
        // Intersection point
        const key = `${h.row},${v.col}`;
        if (!usedCoordsForSpecial.has(key)) {
          specialSpawns.push({
            row: h.row,
            col: v.col,
            color: h.color,
            special: 'bomb'
          });
          usedCoordsForSpecial.add(key);
        }
      }
    }
  }

  // Check 5 in a row -> Singularity
  for (const h of hLines) {
    const len = h.colEnd - h.colStart + 1;
    if (len >= 5) {
      const midCol = Math.floor((h.colStart + h.colEnd) / 2);
      const key = `${h.row},${midCol}`;
      if (!usedCoordsForSpecial.has(key)) {
        specialSpawns.push({
          row: h.row,
          col: midCol,
          color: h.color,
          special: 'singularity'
        });
        usedCoordsForSpecial.add(key);
      }
    } else if (len === 4) {
      const midCol = h.colStart + 1;
      const key = `${h.row},${midCol}`;
      if (!usedCoordsForSpecial.has(key)) {
        specialSpawns.push({
          row: h.row,
          col: midCol,
          color: h.color,
          special: 'beam_h'
        });
        usedCoordsForSpecial.add(key);
      }
    }
  }

  for (const v of vLines) {
    const len = v.rowEnd - v.rowStart + 1;
    if (len >= 5) {
      const midRow = Math.floor((v.rowStart + v.rowEnd) / 2);
      const key = `${midRow},${v.col}`;
      if (!usedCoordsForSpecial.has(key)) {
        specialSpawns.push({
          row: midRow,
          col: v.col,
          color: v.color,
          special: 'singularity'
        });
        usedCoordsForSpecial.add(key);
      }
    } else if (len === 4) {
      const midRow = v.rowStart + 1;
      const key = `${midRow},${v.col}`;
      if (!usedCoordsForSpecial.has(key)) {
        specialSpawns.push({
          row: midRow,
          col: v.col,
          color: v.color,
          special: 'beam_v'
        });
        usedCoordsForSpecial.add(key);
      }
    }
  }

  return { allMatchedCoords, specialSpawns };
}

export function areAdjacent(r1: number, c1: number, r2: number, c2: number): boolean {
  return (Math.abs(r1 - r2) === 1 && c1 === c2) || (Math.abs(c1 - c2) === 1 && r1 === r2);
}

export function hasPossibleMoves(grid: (Gem | null)[][]): boolean {
  const rows = grid.length;
  const cols = grid[0].length;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const current = grid[r][c];
      if (!current) continue;

      // Special gems like singularity or combo items can always swap with neighbors
      if (current.special === 'singularity') return true;

      // Check right swap
      if (c < cols - 1) {
        swapInPlace(grid, r, c, r, c + 1);
        const { allMatchedCoords } = detectMatches(grid);
        swapInPlace(grid, r, c, r, c + 1); // undo
        if (allMatchedCoords.size > 0) return true;
      }

      // Check down swap
      if (r < rows - 1) {
        swapInPlace(grid, r, c, r + 1, c);
        const { allMatchedCoords } = detectMatches(grid);
        swapInPlace(grid, r, c, r + 1, c); // undo
        if (allMatchedCoords.size > 0) return true;
      }
    }
  }
  return false;
}

function swapInPlace(grid: (Gem | null)[][], r1: number, c1: number, r2: number, c2: number) {
  const temp = grid[r1][c1];
  grid[r1][c1] = grid[r2][c2];
  grid[r2][c2] = temp;
}
