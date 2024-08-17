export const colors = {
  white: '255, 255, 255',
  black: '0, 0, 0',
  primary: {
    100: '243, 239, 252',
    200: '230, 222, 249',
    300: '218, 206, 245',
    400: '194, 173, 239',
    500: '169, 140, 233',
    600: '44, 19, 98',
    700: '15, 6, 33',
    default: '132, 90, 223'
  },
  success: {
    100: '233, 249, 244',
    200: '212, 242, 234',
    300: '190, 236, 223',
    400: '147, 223, 202',
    500: '103, 210, 180',
    default: '38, 191, 148'
  },
  danger: {
    100: '253, 238, 236',
    200: '250, 221, 216',
    300: '248, 203, 197',
    400: '243, 169, 158',
    500: '238, 135, 119',
    default: '230, 83, 60'
  },
  warning: {
    100: '254, 248, 237',
    200: '253, 241, 219',
    300: '252, 234, 200',
    400: '250, 220, 164',
    500: '248, 205, 128',
    default: '245, 184, 73'
  },
  info: {
    100: '237, 248, 254',
    200: '219, 240, 253',
    300: '200, 233, 252',
    400: '164, 219, 250',
    500: '128, 204, 248',
    default: '73, 182, 245'
  },
  gray: {
    100: '228, 231, 237',
    200: '220, 223, 230',
    300: '192, 196, 204',
    400: '168, 171, 178',
    500: '144, 147, 153',
    600: '126, 126, 128',
    700: '96, 98, 102',
    800: '48, 49, 51',
    900: '25, 26, 27',
    950: '17, 17, 18'
  }
}

/**
 * Tăng độ sáng của màu RGB.
 *
 * @param {number} r - Giá trị Red (0-255).
 * @param {number} g - Giá trị Green (0-255).
 * @param {number} b - Giá trị Blue (0-255).
 * @param {number} amount - Lượng tăng độ sáng (0-255).
 * @return {string} Chuỗi màu RGB sau khi tăng độ sáng.
 */
export function increaseBrightness(r: number, g: number, b: number, amount: number) {
  // Đảm bảo rằng giá trị sau khi tăng không vượt quá 255
  const newR = Math.min(255, r + amount)
  const newG = Math.min(255, g + amount)
  const newB = Math.min(255, b + amount)

  return `${newR}, ${newG}, ${newB}`
}

export function increaseBrightnessRGB(rgb: string, amount: number) {
  const [r, g, b] = rgb.split(',').map((value) => parseInt(value.trim()))
  return increaseBrightness(r, g, b, amount)
}

export function decreaseBrightness(r: number, g: number, b: number, amount: number) {
  // Đảm bảo rằng giá trị sau khi giảm không nhỏ hơn 0
  const newR = Math.max(0, r - amount)
  const newG = Math.max(0, g - amount)
  const newB = Math.max(0, b - amount)

  return `${newR}, ${newG}, ${newB}`
}

export function decreaseBrightnessRGB(rgb: string, amount: number) {
  const [r, g, b] = rgb.split(',').map((value) => parseInt(value.trim()))
  return decreaseBrightness(r, g, b, amount)
}

export default colors
