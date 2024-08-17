// @ts-nocheck
import type { GlobalThemeOverrides } from 'naive-ui'
import colors from '../colors'
import commonConfig from './_common'

const config: GlobalThemeOverrides = {
  common: {
    primaryColor: `rgb(${colors.primary.default})`,
    primaryColorHover: `rgb(150, 115, 228)`,
    primaryColorPressed: `rgb(119, 81, 201)`,
    primaryColorSuppl: `rgb(59, 40, 100)`,

    errorColor: `rgb(${colors.danger.default})`,
    errorColorHover: `rgb(234, 109, 89)`,
    errorColorPressed: `rgb(207, 75, 54)`,
    errorColorSuppl: `rgb(207, 70, 49)`,

    warningColor: `rgb(${colors.warning.default})`,
    warningColorHover: `rgb(247, 195, 100)`,
    warningColorPressed: `rgb(221, 166, 66)`,
    warningColorSuppl: `rgb(240, 138, 0)`,

    infoColor: `rgb(${colors.info.default})`,
    infoColorHover: `rgb(100, 193, 247)`,
    infoColorPressed: `rgb(66, 164, 221)`,
    infoColorSuppl: `rgb(73, 182, 245)`,

    successColor: `rgb(${colors.success.default})`,
    successColorHover: `rgb(71, 201, 164)`,
    successColorPressed: `rgb(34, 172, 133)`,
    successColorSuppl: `rgb(58, 180, 145)`
  },
  Button: {
    textColorPrimary: '#FFFFFFFF',
    textColorHoverPrimary: '#FFFFFFFF',
    textColorPressedPrimary: '#FFFFFFFF',
    textColorFocusPrimary: '#FFFFFFFF',
    textColorDisabledPrimary: '#FFFFFFFF',
    textColorSuccess: '#FFFFFFFF',
    textColorDisabledSuccess: '#FFFFFFFF',
    textColorFocusSuccess: '#FFFFFFFF',
    textColorPressedSuccess: '#FFFFFFFF',
    textColorHoverSuccess: '#FFFFFFFF',
    textColorError: '#FFFFFFFF',
    textColorDisabledError: '#FFFFFFFF',
    textColorFocusError: '#FFFFFFFF',
    textColorPressedError: '#FFFFFFFF',
    textColorHoverError: '#FFFFFFFF',
    textColorInfo: '#FFFFFFFF',
    textColorDisabledInfo: '#FFFFFFFF',
    textColorFocusInfo: '#FFFFFFFF',
    textColorPressedInfo: '#FFFFFFFF',
    textColorHoverInfo: '#FFFFFFFF',
    textColorWarning: '#FFFFFFFF',
    textColorDisabledWarning: '#FFFFFFFF',
    textColorFocusWarning: '#FFFFFFFF',
    textColorPressedWarning: '#FFFFFFFF',
    textColorHoverWarning: '#FFFFFFFF'
  },
  FloatButton: {
    textColorPrimary: '#FFFFFFFF'
  },
  // DataTable: {
  //   thColor: `rgb(${colors.gray[100]})`,
  //   borderColor: `rgb(${colors.gray[300]})`,
  //   borderRadius: 0,
  //   tdColorHover: '#E8ECF6',
  //   fontSizeSmall: '16px',
  //   fontSizeMedium: '16px'
  // },
  Tabs: {
    tabBorderColor: `rgb(${colors.gray[300]})`
  },
  Layout: {
    siderColor: `#111C43`, // background sider
    color: '#f6f8ff', // background
    textColor: `rgb(${colors.gray[800]})` // text color
  },
  Menu: {
    itemColorHover: `#ffffff0d`,
    itemColorActive: `#ffffff0d`,
    itemColorActiveHover: `#ffffff0d`,
    itemColorActiveCollapsed: `#ffffff0d`,

    itemTextColor: `rgb(${colors.white})`,
    itemTextColorHover: `rgb(${colors.white})`,
    itemIconColor: `rgb(${colors.white})`,
    itemIconColorHover: `rgb(${colors.white})`,
    itemIconColorCollapsed: `rgb(${colors.white})`,

    itemTextColorActive: `rgb(${colors.primary[400]})`,
    itemTextColorActiveHover: `rgb(${colors.primary[400]})`,
    itemTextColorChildActive: `rgb(${colors.primary[400]})`,
    itemTextColorChildActiveHover: `rgb(${colors.primary[400]})`,
    itemIconColorActive: `rgb(${colors.primary[400]})`,
    itemIconColorActiveHover: `rgb(${colors.primary[400]})`,
    itemIconColorChildActive: `rgb(${colors.primary[400]})`,
    itemIconColorChildActiveHover: `rgb(${colors.primary[400]})`,

    arrowColor: `rgba(${colors.white}, 0.7)`,
    arrowColorHover: `rgba(${colors.white}, 1)`,
    arrowColorActive: `rgba(${colors.white}, 1)`,
    arrowColorActiveHover: `rgba(${colors.white}, 1)`,
    arrowColorChildActive: `rgba(${colors.white}, 1)`,
    arrowColorChildActiveHover: `rgba(${colors.white}, 1)`
  }
}

for (const key in commonConfig) {
  config[key] = {
    ...config[key],
    ...commonConfig[key]
  }
}

export default config
