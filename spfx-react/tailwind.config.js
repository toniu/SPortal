/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const plugin = require('tailwindcss/plugin');
const customSpSectionVariant = ['sp-col-1', 'sp-col-1/2', 'sp-col-1/3', 'sp-col-2/3'];

module.exports = {
  purge: {
    enabled: true,
    content: ['./src/**/*.tsx'],
    options: {
      whitelistPatterns: [/^CanvasSection*/]
    }
  },
  theme: {
    extend: {
      colors: {
        themeDarker: 'var(--tw-fui-themeDarker)',
        themeDark: 'var(--tw-fui-themeDark)',
        themeDarkAlt: 'var(--tw-fui-themeDarkAlt)',
        themePrimary: 'var(--tw-fui-themePrimary)',
        themeSecondary: 'var(--tw-fui-themeSecondary)',
        themeTertiary: 'var(--tw-fui-themeTertiary)',
        themeLight: 'var(--tw-fui-themeLight)',
        themeLighter: 'var(--tw-fui-themeLighter)',
        themeLighterAlt: 'var(--tw-fui-themeLighterAlt)',
        //black: 'var(--tw-fui-black)',
        blackTranslucent40: 'var(--tw-fui-blackTranslucent40)',
        neutralDark: 'var(--tw-fui-neutralDark)',
        neutralPrimary: 'var(--tw-fui-neutralPrimary)',
        neutralPrimaryAlt: 'var(--tw-fui-neutralPrimaryAlt)',
        neutralSecondary: 'var(--tw-fui-neutralSecondary)',
        neutralSecondaryAlt: 'var(--tw-fui-neutralSecondaryAlt)',
        neutralTertiary: 'var(--tw-fui-neutralTertiary)',
        neutralTertiaryAlt: 'var(--tw-fui-neutralTertiaryAlt)',
        neutralQuaternary: 'var(--tw-fui-neutralQuaternary)',
        neutralQuaternaryAlt: 'var(--tw-fui-neutralQuaternaryAlt)',
        neutralLight: 'var(--tw-fui-neutralLight)',
        neutralLighter: 'var(--tw-fui-neutralLighter)',
        neutralLighterAlt: 'var(--tw-fui-neutralLighterAlt)',
        accent: 'var(--tw-fui-accent)',
        //white: 'var(--tw-fui-white)',
        whiteTranslucent40: 'var(--tw-fui-whiteTranslucent40)',
        yellow: 'var(--tw-fui-yellow)',
        yellowLight: 'var(--tw-fui-yellowLight)',
        orange: 'var(--tw-fui-orange)',
        orangeLight: 'var(--tw-fui-orangeLight)',
        orangeLighter: 'var(--tw-fui-orangeLighter)',
        redDark: 'var(--tw-fui-redDark)',
        red: 'var(--tw-fui-red)',
        magentaDark: 'var(--tw-fui-magentaDark)',
        magenta: 'var(--tw-fui-magenta)',
        magentaLight: 'var(--tw-fui-magentaLight)',
        purpleDark: 'var(--tw-fui-purpleDark)',
        purple: 'var(--tw-fui-purple)',
        purpleLight: 'var(--tw-fui-purpleLight)',
        blueDark: 'var(--tw-fui-blueDark)',
        blueMid: 'var(--tw-fui-blueMid)',
        blue: 'var(--tw-fui-blue)',
        blueLight: 'var(--tw-fui-blueLight)',
        tealDark: 'var(--tw-fui-tealDark)',
        teal: 'var(--tw-fui-teal)',
        tealLight: 'var(--tw-fui-tealLight)',
        greenDark: 'var(--tw-fui-greenDark)',
        green: 'var(--tw-fui-green)',
        greenLight: 'var(--tw-fui-greenLight)',
        /* ***** */
        bodyBackground: 'var(--tw-fui-bodyBackground)',
        bodyStandoutBackground: 'var(--tw-fui-bodyStandoutBackground)',
        bodyFrameBackground: 'var(--tw-fui-bodyFrameBackground)',
        bodyFrameDivider: 'var(--tw-fui-bodyFrameDivider)',
        bodyText: 'var(--tw-fui-bodyText)',
        bodyTextChecked: 'var(--tw-fui-bodyTextChecked)',
        bodySubtext: 'var(--tw-fui-bodySubtext)',
        bodyDivider: 'var(--tw-fui-bodyDivider)',
        disabledBackground: 'var(--tw-fui-disabledBackground)',
        disabledText: 'var(--tw-fui-disabledText)',
        disabledSubtext: 'var(--tw-fui-disabledSubtext)',
        disabledBodyText: 'var(--tw-fui-disabledBodyText)',
        disabledBodySubtext: 'var(--tw-fui-disabledBodySubtext)',
        focusBorder: 'var(--tw-fui-focusBorder)',
        variantBorder: 'var(--tw-fui-variantBorder)',
        variantBorderHovered: 'var(--tw-fui-variantBorderHovered)',
        defaultStateBackground: 'var(--tw-fui-defaultStateBackground)',
        errorText: 'var(--tw-fui-errorText)',
        warningText: 'var(--tw-fui-warningText)',
        errorBackground: 'var(--tw-fui-errorBackground)',
        blockingBackground: 'var(--tw-fui-blockingBackground)',
        warningBackground: 'var(--tw-fui-warningBackground)',
        warningHighlight: 'var(--tw-fui-warningHighlight)',
        successBackground: 'var(--tw-fui-successBackground)',
        inputBorder: 'var(--tw-fui-inputBorder)',
        inputBorderHovered: 'var(--tw-fui-inputBorderHovered)',
        inputBackground: 'var(--tw-fui-inputBackground)',
        inputBackgroundChecked: 'var(--tw-fui-inputBackgroundChecked)',
        inputBackgroundCheckedHovered: 'var(--tw-fui-inputBackgroundCheckedHovered)',
        inputForegroundChecked: 'var(--tw-fui-inputForegroundChecked)',
        inputFocusBorderAlt: 'var(--tw-fui-inputFocusBorderAlt)',
        smallInputBorder: 'var(--tw-fui-smallInputBorder)',
        inputText: 'var(--tw-fui-inputText)',
        inputTextHovered: 'var(--tw-fui-inputTextHovered)',
        inputPlaceholderText: 'var(--tw-fui-inputPlaceholderText)',
        buttonBackground: 'var(--tw-fui-buttonBackground)',
        buttonBackgroundChecked: 'var(--tw-fui-buttonBackgroundChecked)',
        buttonBackgroundHovered: 'var(--tw-fui-buttonBackgroundHovered)',
        buttonBackgroundCheckedHovered: 'var(--tw-fui-buttonBackgroundCheckedHovered)',
        buttonBackgroundPressed: 'var(--tw-fui-buttonBackgroundPressed)',
        buttonBackgroundDisabled: 'var(--tw-fui-buttonBackgroundDisabled)',
        buttonBorder: 'var(--tw-fui-buttonBorder)',
        buttonText: 'var(--tw-fui-buttonText)',
        buttonTextHovered: 'var(--tw-fui-buttonTextHovered)',
        buttonTextChecked: 'var(--tw-fui-buttonTextChecked)',
        buttonTextCheckedHovered: 'var(--tw-fui-buttonTextCheckedHovered)',
        buttonTextPressed: 'var(--tw-fui-buttonTextPressed)',
        buttonTextDisabled: 'var(--tw-fui-buttonTextDisabled)',
        buttonBorderDisabled: 'var(--tw-fui-buttonBorderDisabled)',
        primaryButtonBackground: 'var(--tw-fui-primaryButtonBackground)',
        primaryButtonBackgroundHovered: 'var(--tw-fui-primaryButtonBackgroundHovered)',
        primaryButtonBackgroundPressed: 'var(--tw-fui-primaryButtonBackgroundPressed)',
        primaryButtonBackgroundDisabled: 'var(--tw-fui-primaryButtonBackgroundDisabled)',
        primaryButtonBorder: 'var(--tw-fui-primaryButtonBorder)',
        primaryButtonText: 'var(--tw-fui-primaryButtonText)',
        primaryButtonTextHovered: 'var(--tw-fui-primaryButtonTextHovered)',
        primaryButtonTextPressed: 'var(--tw-fui-primaryButtonTextPressed)',
        primaryButtonTextDisabled: 'var(--tw-fui-primaryButtonTextDisabled)',
        accentButtonBackground: 'var(--tw-fui-accentButtonBackground)',
        accentButtonText: 'var(--tw-fui-accentButtonText)',
        menuBackground: 'var(--tw-fui-menuBackground)',
        menuDivider: 'var(--tw-fui-menuDivider)',
        menuIcon: 'var(--tw-fui-menuIcon)',
        menuHeader: 'var(--tw-fui-menuHeader)',
        menuItemBackgroundHovered: 'var(--tw-fui-menuItemBackgroundHovered)',
        menuItemBackgroundPressed: 'var(--tw-fui-menuItemBackgroundPressed)',
        menuItemText: 'var(--tw-fui-menuItemText)',
        menuItemTextHovered: 'var(--tw-fui-menuItemTextHovered)',
        listBackground: 'var(--tw-fui-listBackground)',
        listText: 'var(--tw-fui-listText)',
        listItemBackgroundHovered: 'var(--tw-fui-listItemBackgroundHovered)',
        listItemBackgroundChecked: 'var(--tw-fui-listItemBackgroundChecked)',
        listItemBackgroundCheckedHovered: 'var(--tw-fui-listItemBackgroundCheckedHovered)',
        listHeaderBackgroundHovered: 'var(--tw-fui-listHeaderBackgroundHovered)',
        listHeaderBackgroundPressed: 'var(--tw-fui-listHeaderBackgroundPressed)',
        actionLink: 'var(--tw-fui-actionLink)',
        actionLinkHovered: 'var(--tw-fui-actionLinkHovered)',
        link: 'var(--tw-fui-link)',
        linkHovered: 'var(--tw-fui-linkHovered)',
        listTextColor: 'var(--tw-fui-listTextColor)',
        menuItemBackgroundChecked: 'var(--tw-fui-menuItemBackgroundChecked)',
      }
    },
  },
  variants: {
    accessibility: customSpSectionVariant.concat(['hover', 'focus']),
    alignContent: customSpSectionVariant.concat(['hover', 'focus']),
    alignItems: customSpSectionVariant.concat(['hover', 'focus']),
    alignSelf: customSpSectionVariant.concat(['hover', 'focus']),
    appearance: customSpSectionVariant.concat(['hover', 'focus']),
    backgroundAttachment: customSpSectionVariant.concat(['hover', 'focus']),
    backgroundClip: customSpSectionVariant.concat(['hover', 'focus']),
    backgroundColor: customSpSectionVariant.concat(['hover', 'focus']),
    backgroundImage: customSpSectionVariant.concat(['hover', 'focus']),
    gradientColorStops: customSpSectionVariant.concat(['hover', 'focus']),
    backgroundOpacity: customSpSectionVariant.concat(['hover', 'focus']),
    backgroundPosition: customSpSectionVariant.concat(['hover', 'focus']),
    backgroundRepeat: customSpSectionVariant.concat(['hover', 'focus']),
    backgroundSize: customSpSectionVariant.concat(['hover', 'focus']),
    borderCollapse: customSpSectionVariant.concat(['hover', 'focus']),
    borderColor: customSpSectionVariant.concat(['hover', 'focus']),
    borderOpacity: customSpSectionVariant.concat(['hover', 'focus']),
    borderRadius: customSpSectionVariant.concat(['hover', 'focus']),
    borderStyle: customSpSectionVariant.concat(['hover', 'focus']),
    borderWidth: customSpSectionVariant.concat(['hover', 'focus']),
    boxShadow: customSpSectionVariant.concat(['hover', 'focus']),
    boxSizing: customSpSectionVariant.concat(['hover', 'focus']),
    container: customSpSectionVariant.concat(['hover', 'focus']),
    cursor: customSpSectionVariant.concat(['hover', 'focus']),
    display: customSpSectionVariant.concat(['hover', 'focus']),
    divideColor: customSpSectionVariant.concat(['hover', 'focus']),
    divideOpacity: customSpSectionVariant.concat(['hover', 'focus']),
    divideStyle: customSpSectionVariant.concat(['hover', 'focus']),
    divideWidth: customSpSectionVariant.concat(['hover', 'focus']),
    fill: customSpSectionVariant.concat(['hover', 'focus']),
    flex: customSpSectionVariant.concat(['hover', 'focus']),
    flexDirection: customSpSectionVariant.concat(['hover', 'focus']),
    flexGrow: customSpSectionVariant.concat(['hover', 'focus']),
    flexShrink: customSpSectionVariant.concat(['hover', 'focus']),
    flexWrap: customSpSectionVariant.concat(['hover', 'focus']),
    float: customSpSectionVariant.concat(['hover', 'focus']),
    clear: customSpSectionVariant.concat(['hover', 'focus']),
    fontFamily: customSpSectionVariant.concat(['hover', 'focus']),
    fontSize: customSpSectionVariant.concat(['hover', 'focus']),
    fontSmoothing: customSpSectionVariant.concat(['hover', 'focus']),
    fontVariantNumeric: customSpSectionVariant.concat(['hover', 'focus']),
    fontStyle: customSpSectionVariant.concat(['hover', 'focus']),
    fontWeight: customSpSectionVariant.concat(['hover', 'focus']),
    height: customSpSectionVariant.concat(['hover', 'focus']),
    inset: customSpSectionVariant.concat(['hover', 'focus']),
    justifyContent: customSpSectionVariant.concat(['hover', 'focus']),
    justifyItems: customSpSectionVariant.concat(['hover', 'focus']),
    justifySelf: customSpSectionVariant.concat(['hover', 'focus']),
    letterSpacing: customSpSectionVariant.concat(['hover', 'focus']),
    lineHeight: customSpSectionVariant.concat(['hover', 'focus']),
    listStylePosition: customSpSectionVariant.concat(['hover', 'focus']),
    listStyleType: customSpSectionVariant.concat(['hover', 'focus']),
    margin: customSpSectionVariant.concat(['hover', 'focus']),
    maxHeight: customSpSectionVariant.concat(['hover', 'focus']),
    maxWidth: customSpSectionVariant.concat(['hover', 'focus']),
    minHeight: customSpSectionVariant.concat(['hover', 'focus']),
    minWidth: customSpSectionVariant.concat(['hover', 'focus']),
    objectFit: customSpSectionVariant.concat(['hover', 'focus']),
    objectPosition: customSpSectionVariant.concat(['hover', 'focus']),
    opacity: customSpSectionVariant.concat(['hover', 'focus']),
    order: customSpSectionVariant.concat(['hover', 'focus']),
    outline: customSpSectionVariant.concat(['hover', 'focus']),
    overflow: customSpSectionVariant.concat(['hover', 'focus']),
    overscrollBehavior: customSpSectionVariant.concat(['hover', 'focus']),
    padding: customSpSectionVariant.concat(['hover', 'focus']),
    placeContent: customSpSectionVariant.concat(['hover', 'focus']),
    placeItems: customSpSectionVariant.concat(['hover', 'focus']),
    placeSelf: customSpSectionVariant.concat(['hover', 'focus']),
    placeholderColor: customSpSectionVariant.concat(['focus']),
    placeholderOpacity: customSpSectionVariant.concat(['focus']),
    pointerEvents: customSpSectionVariant.concat(['hover', 'focus']),
    position: customSpSectionVariant.concat(['hover', 'focus']),
    resize: customSpSectionVariant.concat(['hover', 'focus']),
    space: customSpSectionVariant.concat(['hover', 'focus']),
    stroke: customSpSectionVariant.concat(['hover', 'focus']),
    strokeWidth: customSpSectionVariant.concat(['hover', 'focus']),
    tableLayout: customSpSectionVariant.concat(['hover', 'focus']),
    textAlign: customSpSectionVariant.concat(['hover', 'focus']),
    textColor: customSpSectionVariant.concat(['hover', 'focus']),
    textOpacity: customSpSectionVariant.concat(['hover', 'focus']),
    textDecoration: customSpSectionVariant.concat(['hover', 'focus']),
    textTransform: customSpSectionVariant.concat(['hover', 'focus']),
    userSelect: customSpSectionVariant.concat(['hover', 'focus']),
    verticalAlign: customSpSectionVariant.concat(['hover', 'focus']),
    visibility: customSpSectionVariant.concat(['hover', 'focus']),
    whitespace: customSpSectionVariant.concat(['hover', 'focus']),
    width: customSpSectionVariant.concat(['hover', 'focus']),
    wordBreak: customSpSectionVariant.concat(['hover', 'focus']),
    zIndex: customSpSectionVariant.concat(['hover', 'focus']),
    gap: customSpSectionVariant.concat(['hover', 'focus']),
    gridAutoFlow: customSpSectionVariant.concat(['hover', 'focus']),
    gridTemplateColumns: customSpSectionVariant.concat(['hover', 'focus']),
    gridColumn: customSpSectionVariant.concat(['hover', 'focus']),
    gridColumnStart: customSpSectionVariant.concat(['hover', 'focus']),
    gridColumnEnd: customSpSectionVariant.concat(['hover', 'focus']),
    gridTemplateRows: customSpSectionVariant.concat(['hover', 'focus']),
    gridRow: customSpSectionVariant.concat(['hover', 'focus']),
    gridRowStart: customSpSectionVariant.concat(['hover', 'focus']),
    gridRowEnd: customSpSectionVariant.concat(['hover', 'focus']),
    transform: customSpSectionVariant.concat(['hover', 'focus']),
    transformOrigin: customSpSectionVariant.concat(['hover', 'focus']),
    scale: customSpSectionVariant.concat(['hover', 'focus']),
    rotate: customSpSectionVariant.concat(['hover', 'focus']),
    translate: customSpSectionVariant.concat(['hover', 'focus']),
    skew: customSpSectionVariant.concat(['hover', 'focus']),
    transitionProperty: customSpSectionVariant.concat(['hover', 'focus']),
    transitionTimingFunction: customSpSectionVariant.concat(['hover', 'focus']),
    transitionDuration: customSpSectionVariant.concat(['hover', 'focus']),
    transitionDelay: customSpSectionVariant.concat(['hover', 'focus']),
    animation: customSpSectionVariant
  },
  plugins: [
    plugin(function ({ addVariant, e }) {
      addVariant('sp-col-1', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.CanvasSection.CanvasSection-col.CanvasSection-xl12 .${e(`sp-col-1${separator}${className}`)}`
        })
      }),
        addVariant('sp-col-1/2', ({ modifySelectors, separator }) => {
          modifySelectors(({ className }) => {
            return `.CanvasSection.CanvasSection-col.CanvasSection-xl6 .${e(`sp-col-1/2${separator}${className}`)}`
          })
        }),
        addVariant('sp-col-1/3', ({ modifySelectors, separator }) => {
          modifySelectors(({ className }) => {
            return `.CanvasSection.CanvasSection-col.CanvasSection-xl4 .${e(`sp-col-1/3${separator}${className}`)}`
          })
        }),
        addVariant('sp-col-2/3', ({ modifySelectors, separator }) => {
          modifySelectors(({ className }) => {
            return `.CanvasSection.CanvasSection-col.CanvasSection-xl8 .${e(`sp-col-2/3${separator}${className}`)}`
          })
        })
    })
  ],
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true
  }
};