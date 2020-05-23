enum Color {
  white = 'white',
  green = 'green',
  red = 'red',
  blue = 'blue',
  orange = 'orange',
  yellow = 'yellow',
}

export const solvedColors = [Color.white, Color.green, Color.red, Color.blue, Color.orange, Color.yellow].flatMap((c: Color): Array<Color> => Array(9).fill(c))
