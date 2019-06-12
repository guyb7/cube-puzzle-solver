const _ = require('lodash')
const SIZE = 3

/*
  0: [
  1: -[]-
  2: -[.]
*/

const quit = (msg, obj) => {
  if (typeof obj !== 'undefined') {
    console.log(JSON.stringify(obj))
  }
  console.error(msg)
  process.exit(0)
}

const stack = [
  0, 1, 2,
  2, 2,
  2, 2,
  2, 1, 2,
  2, 1, 2,
  2, 2,
  2,
  2, 1, 2,
  2, 1, 2,
  2, 2,
  2, 1, 0
]

const board = []
for (let x = 0; x < SIZE; x++) {
  board[x] = []
  for (let y = 0; y < SIZE; y++) {
    board[x][y] = []
    for (let z = 0; z < SIZE; z++) {
      board[x][y][z] = false
    }
  }
}

const pos = {
  x: 1,
  y: 1,
  z: 0,
  prev_dir: null
}

const history = []

const is_valid_pos = (pos, board) => {
  if (pos.x < 0 || pos.y < 0 || pos.z < 0) {
    return false
  }
  if (pos.x >= SIZE || pos.y >= SIZE || pos.z >= SIZE) {
    return false
  }
  if (board[pos.x][pos.y][pos.z] !== false) {
    return false
  }
  return true
}

const get_side_dirs = dir => {
  switch (dir) {
    case 'u':
    case 'd':
      return ['n', 'e', 's', 'w']
    case 'e':
    case 'w':
      return ['u', 'd', 's', 'n']
    case 'n':
    case 's':
      return ['u', 'd', 'e', 'w']
    default:
      quit('Invalid direction', dir)
  }
}

const get_new_pos = (current_pos, dir) => {
  const new_pos = _.clone(current_pos)
  new_pos.prev_dir = dir
  switch (dir) {
    case 'u':
      new_pos.y++
      break
    case 'd':
      new_pos.y--
      break
    case 'e':
      new_pos.x++
      break
    case 'w':
      new_pos.x--
      break
    case 'n':
      new_pos.z++
      break
    case 's':
      new_pos.z--
      break
    default:
      quit('Invalid new pos direction', dir)
  }
  return new_pos
}

const move = input => {
  const {
    board, stack, pos, history
  } = _.cloneDeep(input)
  // _.times(history.length, () => {
  //   process.stdout.write(' ')
  // })
  // console.log((pos.prev_dir || '.') + ` ${pos.x},${pos.y},${pos.z}`)
  if (stack.length === 0) {
    quit('Done', history)
  }
  if (!is_valid_pos(pos, board)) {
    return
  }
  board[pos.x][pos.y][pos.z] = true
  history.push(pos.prev_dir)
  const piece = stack.pop()
  let next_directions = []
  switch (piece) {
    case 0:
      // Set here initial direction
      next_directions = ['n']
      break
    case 1:
      next_directions = [pos.prev_dir]
      break
    case 2:
      next_directions = get_side_dirs(pos.prev_dir)
      break
    default:
      quit('Invalid piece', piece)
  }
  _.each(next_directions, dir => {
    const new_pos = get_new_pos(pos, dir)
    move({ board, stack, pos: new_pos, history })
  })
  return
}

move({ board, stack, pos, history })
