// @ts-nocheck
import type { GlobalThemeOverrides } from 'naive-ui'
import colors, { decreaseBrightnessRGB } from '../colors'
import commonConfig from './_common'

const config: GlobalThemeOverrides = {
  common: {
    primaryColor: `rgb(${decreaseBrightnessRGB(colors.primary.default, 0)})`,
    primaryColorHover: `rgb(${decreaseBrightnessRGB('150, 115, 228', 0)})`,
    primaryColorPressed: `rgb(${decreaseBrightnessRGB('119, 81, 201', 0)})`,
    primaryColorSuppl: `rgb(${decreaseBrightnessRGB('59, 40, 100', 0)})`,

    errorColor: `rgb(${decreaseBrightnessRGB(colors.danger.default, 25)})`,
    errorColorHover: `rgb(${decreaseBrightnessRGB('234, 109, 89', 25)})`,
    errorColorPressed: `rgb(${decreaseBrightnessRGB('207, 75, 54', 25)})`,
    errorColorSuppl: `rgb(${decreaseBrightnessRGB('207, 70, 49', 25)})`,

    warningColor: `rgb(${decreaseBrightnessRGB(colors.warning.default, 25)})`,
    warningColorHover: `rgb(${decreaseBrightnessRGB('247, 195, 100', 25)})`,
    warningColorPressed: `rgb(${decreaseBrightnessRGB('221, 166, 66', 25)})`,
    warningColorSuppl: `rgb(${decreaseBrightnessRGB('240, 138, 0', 25)})`,

    infoColor: `rgb(${decreaseBrightnessRGB(colors.info.default, 25)})`,
    infoColorHover: `rgb(${decreaseBrightnessRGB('100, 193, 247', 25)})`,
    infoColorPressed: `rgb(${decreaseBrightnessRGB('66, 164, 221', 25)})`,
    infoColorSuppl: `rgb(${decreaseBrightnessRGB('73, 182, 245', 25)})`,

    successColor: `rgb(${decreaseBrightnessRGB(colors.success.default, 25)})`,
    successColorHover: `rgb(${decreaseBrightnessRGB('71, 201, 164', 25)})`,
    successColorPressed: `rgb(${decreaseBrightnessRGB('34, 172, 133', 25)})`,
    successColorSuppl: `rgb(${decreaseBrightnessRGB('58, 180, 145', 25)})`,

    inputColor: `rgba(${colors.gray[800]}, 0.7)`,
    hoverColor: `rgba(${colors.gray[700]}, 0.3)`,
    popoverColor: `rgb(${colors.gray[800]})`,
    modalColor: `rgb(28, 28, 28)`
  },
  Layout: {
    siderColor: `rgb(${colors.gray[900]})`, // background sider
    color: `rgb(${colors.gray[950]})`, // background
    textColor: `rgb(${colors.gray[100]})` // text color
  },
  Button: {
    textColorPrimary: `rgb(${colors.gray[100]})`,
    textColorHoverPrimary: `rgb(${colors.gray[100]})`,
    textColorPressedPrimary: `rgb(${colors.gray[100]})`,
    textColorFocusPrimary: `rgb(${colors.gray[100]})`,
    textColorDisabledPrimary: `rgb(${colors.gray[100]})`,
    textColorSuccess: `rgb(${colors.gray[100]})`,
    textColorDisabledSuccess: `rgb(${colors.gray[100]})`,
    textColorFocusSuccess: `rgb(${colors.gray[100]})`,
    textColorPressedSuccess: `rgb(${colors.gray[100]})`,
    textColorHoverSuccess: `rgb(${colors.gray[100]})`,
    textColorError: `rgb(${colors.gray[100]})`,
    textColorDisabledError: `rgb(${colors.gray[100]})`,
    textColorFocusError: `rgb(${colors.gray[100]})`,
    textColorPressedError: `rgb(${colors.gray[100]})`,
    textColorHoverError: `rgb(${colors.gray[100]})`,
    textColorInfo: `rgb(${colors.gray[100]})`,
    textColorDisabledInfo: `rgb(${colors.gray[100]})`,
    textColorFocusInfo: `rgb(${colors.gray[100]})`,
    textColorPressedInfo: `rgb(${colors.gray[100]})`,
    textColorHoverInfo: `rgb(${colors.gray[100]})`,
    textColorWarning: `rgb(${colors.gray[100]})`,
    textColorDisabledWarning: `rgb(${colors.gray[100]})`,
    textColorFocusWarning: `rgb(${colors.gray[100]})`,
    textColorPressedWarning: `rgb(${colors.gray[100]})`,
    textColorHoverWarning: `rgb(${colors.gray[100]})`
  },
  DataTable: {
    tdColor: `rgb(${colors.gray[900]})`
    // tdColorModal: `rgb(${colors.gray[900]})`
  }
}

for (const key in commonConfig) {
  config[key] = {
    ...config[key],
    ...commonConfig[key]
  }
}

export default config
