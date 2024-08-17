import type { GlobalThemeOverrides } from 'naive-ui'

export default {
  common: {
    fontFamily:
      'Inter, v-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    fontSize: '14px',
    fontSizeMedium: '14px',
    fontSizeLarge: '16px',
    fontSizeHuge: '18px',
    heightSmall: '30px',
    heightMedium: '38px',
    borderRadius: '4px',
    borderRadiusSmall: '4px'
  },
  Button: {
    fontWeightStrong: 600,
    iconSizeSmall: '16px',
    paddingSmall: '0 7px',
    fontSizeMedium: '16px',
    heightSmall: '28px',
    fontSizeSmall: '12px'
  },
  Card: {
    paddingSmall: '16px 20px'
  },
  Tabs: {
    tabGapSmallLine: '32px',
    tabPaddingSmallLine: '8px 0 4px',
    tabFontWeightActive: 600
  },
  Tag: {
    fontSizeTiny: '12px',
    fontSizeSmall: '14px',
    fontSizeMedium: '16px',
    fontSizeLarge: '18px'
  },
  DataTable: {
    thPaddingSmall: '10px',
    thFontWeight: 600,
    fontSizeSmall: '12px',
    tdPaddingSmall: '5px 10px',
    thColor: '#F3F3F3'
  },
  Collapse: {
    titlePadding: '0 0 0 0',
    itemMargin: '12px 0 0 0'
  },
  Spin: {
    sizeSmall: '20px'
  },
  Checkbox: {
    colorChecked: '#23B7E5',
    border: '1px solid #23B7E5',
    borderChecked: '1px solid #23B7E5',
    borderFocus: '1px solid #23B7E5'
  }
} as GlobalThemeOverrides
