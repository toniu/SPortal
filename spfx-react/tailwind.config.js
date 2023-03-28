/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const plugin = require("tailwindcss/plugin");
const colors = require('tailwindcss/colors')

const customSpSectionVariant = [
  "sp-col-1",
  "sp-col-1/2",
  "sp-col-1/3",
  "sp-col-2/3",
];

module.exports = {
  content: {
    enabled: true,
    content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
    options: {
      whitelistPatterns: [/^CanvasSection*/],
    },
  },
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        current: "currentColor",
        black: colors.black,
        white: colors.white,
        gray: colors.gray,
        red: colors.red,
        orange: colors.orange,
        amber: colors.amber,
        emerald: colors.emerald,
        indigo: colors.indigo,
        yellow: colors.yellow,
        green: colors.green,
        teal: colors.teal,
        cyan: colors.cyan,
        blue: colors.blue,
        pink: colors.pink
      },
    },
  },
  variants: {
    accessibility: customSpSectionVariant.concat(["hover", "focus"]),
    alignContent: customSpSectionVariant.concat(["hover", "focus"]),
    alignItems: customSpSectionVariant.concat(["hover", "focus"]),
    alignSelf: customSpSectionVariant.concat(["hover", "focus"]),
    appearance: customSpSectionVariant.concat(["hover", "focus"]),
    backgroundAttachment: customSpSectionVariant.concat(["hover", "focus"]),
    backgroundClip: customSpSectionVariant.concat(["hover", "focus"]),
    backgroundColor: customSpSectionVariant.concat(["hover", "focus"]),
    backgroundImage: customSpSectionVariant.concat(["hover", "focus"]),
    gradientColorStops: customSpSectionVariant.concat(["hover", "focus"]),
    backgroundOpacity: customSpSectionVariant.concat(["hover", "focus"]),
    backgroundPosition: customSpSectionVariant.concat(["hover", "focus"]),
    backgroundRepeat: customSpSectionVariant.concat(["hover", "focus"]),
    backgroundSize: customSpSectionVariant.concat(["hover", "focus"]),
    borderCollapse: customSpSectionVariant.concat(["hover", "focus"]),
    borderColor: customSpSectionVariant.concat(["hover", "focus"]),
    borderOpacity: customSpSectionVariant.concat(["hover", "focus"]),
    borderRadius: customSpSectionVariant.concat(["hover", "focus"]),
    borderStyle: customSpSectionVariant.concat(["hover", "focus"]),
    borderWidth: customSpSectionVariant.concat(["hover", "focus"]),
    boxShadow: customSpSectionVariant.concat(["hover", "focus"]),
    boxSizing: customSpSectionVariant.concat(["hover", "focus"]),
    container: customSpSectionVariant.concat(["hover", "focus"]),
    cursor: customSpSectionVariant.concat(["hover", "focus"]),
    display: customSpSectionVariant.concat(["hover", "focus"]),
    divideColor: customSpSectionVariant.concat(["hover", "focus"]),
    divideOpacity: customSpSectionVariant.concat(["hover", "focus"]),
    divideStyle: customSpSectionVariant.concat(["hover", "focus"]),
    divideWidth: customSpSectionVariant.concat(["hover", "focus"]),
    fill: customSpSectionVariant.concat(["hover", "focus"]),
    flex: customSpSectionVariant.concat(["hover", "focus"]),
    flexDirection: customSpSectionVariant.concat(["hover", "focus"]),
    flexGrow: customSpSectionVariant.concat(["hover", "focus"]),
    flexShrink: customSpSectionVariant.concat(["hover", "focus"]),
    flexWrap: customSpSectionVariant.concat(["hover", "focus"]),
    float: customSpSectionVariant.concat(["hover", "focus"]),
    clear: customSpSectionVariant.concat(["hover", "focus"]),
    fontFamily: customSpSectionVariant.concat(["hover", "focus"]),
    fontSize: customSpSectionVariant.concat(["hover", "focus"]),
    fontSmoothing: customSpSectionVariant.concat(["hover", "focus"]),
    fontVariantNumeric: customSpSectionVariant.concat(["hover", "focus"]),
    fontStyle: customSpSectionVariant.concat(["hover", "focus"]),
    fontWeight: customSpSectionVariant.concat(["hover", "focus"]),
    height: customSpSectionVariant.concat(["hover", "focus"]),
    inset: customSpSectionVariant.concat(["hover", "focus"]),
    justifyContent: customSpSectionVariant.concat(["hover", "focus"]),
    justifyItems: customSpSectionVariant.concat(["hover", "focus"]),
    justifySelf: customSpSectionVariant.concat(["hover", "focus"]),
    letterSpacing: customSpSectionVariant.concat(["hover", "focus"]),
    lineHeight: customSpSectionVariant.concat(["hover", "focus"]),
    listStylePosition: customSpSectionVariant.concat(["hover", "focus"]),
    listStyleType: customSpSectionVariant.concat(["hover", "focus"]),
    margin: customSpSectionVariant.concat(["hover", "focus"]),
    maxHeight: customSpSectionVariant.concat(["hover", "focus"]),
    maxWidth: customSpSectionVariant.concat(["hover", "focus"]),
    minHeight: customSpSectionVariant.concat(["hover", "focus"]),
    minWidth: customSpSectionVariant.concat(["hover", "focus"]),
    objectFit: customSpSectionVariant.concat(["hover", "focus"]),
    objectPosition: customSpSectionVariant.concat(["hover", "focus"]),
    opacity: customSpSectionVariant.concat(["hover", "focus"]),
    order: customSpSectionVariant.concat(["hover", "focus"]),
    outline: customSpSectionVariant.concat(["hover", "focus"]),
    overflow: customSpSectionVariant.concat(["hover", "focus"]),
    overscrollBehavior: customSpSectionVariant.concat(["hover", "focus"]),
    padding: customSpSectionVariant.concat(["hover", "focus"]),
    placeContent: customSpSectionVariant.concat(["hover", "focus"]),
    placeItems: customSpSectionVariant.concat(["hover", "focus"]),
    placeSelf: customSpSectionVariant.concat(["hover", "focus"]),
    placeholderColor: customSpSectionVariant.concat(["focus"]),
    placeholderOpacity: customSpSectionVariant.concat(["focus"]),
    pointerEvents: customSpSectionVariant.concat(["hover", "focus"]),
    position: customSpSectionVariant.concat(["hover", "focus"]),
    resize: customSpSectionVariant.concat(["hover", "focus"]),
    space: customSpSectionVariant.concat(["hover", "focus"]),
    stroke: customSpSectionVariant.concat(["hover", "focus"]),
    strokeWidth: customSpSectionVariant.concat(["hover", "focus"]),
    tableLayout: customSpSectionVariant.concat(["hover", "focus"]),
    textAlign: customSpSectionVariant.concat(["hover", "focus"]),
    textColor: customSpSectionVariant.concat(["hover", "focus"]),
    textOpacity: customSpSectionVariant.concat(["hover", "focus"]),
    textDecoration: customSpSectionVariant.concat(["hover", "focus"]),
    textTransform: customSpSectionVariant.concat(["hover", "focus"]),
    userSelect: customSpSectionVariant.concat(["hover", "focus"]),
    verticalAlign: customSpSectionVariant.concat(["hover", "focus"]),
    visibility: customSpSectionVariant.concat(["hover", "focus"]),
    whitespace: customSpSectionVariant.concat(["hover", "focus"]),
    width: customSpSectionVariant.concat(["hover", "focus"]),
    wordBreak: customSpSectionVariant.concat(["hover", "focus"]),
    zIndex: customSpSectionVariant.concat(["hover", "focus"]),
    gap: customSpSectionVariant.concat(["hover", "focus"]),
    gridAutoFlow: customSpSectionVariant.concat(["hover", "focus"]),
    gridTemplateColumns: customSpSectionVariant.concat(["hover", "focus"]),
    gridColumn: customSpSectionVariant.concat(["hover", "focus"]),
    gridColumnStart: customSpSectionVariant.concat(["hover", "focus"]),
    gridColumnEnd: customSpSectionVariant.concat(["hover", "focus"]),
    gridTemplateRows: customSpSectionVariant.concat(["hover", "focus"]),
    gridRow: customSpSectionVariant.concat(["hover", "focus"]),
    gridRowStart: customSpSectionVariant.concat(["hover", "focus"]),
    gridRowEnd: customSpSectionVariant.concat(["hover", "focus"]),
    transform: customSpSectionVariant.concat(["hover", "focus"]),
    transformOrigin: customSpSectionVariant.concat(["hover", "focus"]),
    scale: customSpSectionVariant.concat(["hover", "focus"]),
    rotate: customSpSectionVariant.concat(["hover", "focus"]),
    translate: customSpSectionVariant.concat(["hover", "focus"]),
    skew: customSpSectionVariant.concat(["hover", "focus"]),
    transitionProperty: customSpSectionVariant.concat(["hover", "focus"]),
    transitionTimingFunction: customSpSectionVariant.concat(["hover", "focus"]),
    transitionDuration: customSpSectionVariant.concat(["hover", "focus"]),
    transitionDelay: customSpSectionVariant.concat(["hover", "focus"]),
    animation: customSpSectionVariant,
  },
  plugins: [
    plugin(function ({ addVariant, e }) {
      addVariant("sp-col-1", ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.CanvasSection.CanvasSection-col.CanvasSection-xl12 .${e(
            `sp-col-1${separator}${className}`
          )}`;
        });
      }),
        addVariant("sp-col-1/2", ({ modifySelectors, separator }) => {
          modifySelectors(({ className }) => {
            return `.CanvasSection.CanvasSection-col.CanvasSection-xl6 .${e(
              `sp-col-1/2${separator}${className}`
            )}`;
          });
        }),
        addVariant("sp-col-1/3", ({ modifySelectors, separator }) => {
          modifySelectors(({ className }) => {
            return `.CanvasSection.CanvasSection-col.CanvasSection-xl4 .${e(
              `sp-col-1/3${separator}${className}`
            )}`;
          });
        }),
        addVariant("sp-col-2/3", ({ modifySelectors, separator }) => {
          modifySelectors(({ className }) => {
            return `.CanvasSection.CanvasSection-col.CanvasSection-xl8 .${e(
              `sp-col-2/3${separator}${className}`
            )}`;
          });
        });
    }),
  ],
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
};
