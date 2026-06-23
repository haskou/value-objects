import { defineConfig } from 'vitepress';

const referenceSidebar = [
  {
    text: 'Overview',
    items: [
      { text: 'Reference overview', link: '/reference/' },
    ],
  },
  {
    text: 'Base',
    collapsed: false,
    items: [
      { text: 'ValueObject', link: '/reference/value-object' },
      { text: 'NullObject', link: '/reference/null-object' },
      { text: 'Enum', link: '/reference/enum' },
    ],
  },
  {
    text: 'Strings',
    collapsed: false,
    items: [
      { text: 'StringValueObject', link: '/reference/string-value-object' },
      { text: 'Email', link: '/reference/email' },
      { text: 'Color', link: '/reference/color' },
      { text: 'Password', link: '/reference/password' },
    ],
  },
  {
    text: 'Numbers',
    collapsed: false,
    items: [
      { text: 'NumberValueObject', link: '/reference/number-value-object' },
      { text: 'Integer', link: '/reference/integer' },
      { text: 'PositiveNumber', link: '/reference/positive-number' },
    ],
  },
  {
    text: 'Identifiers',
    collapsed: true,
    items: [
      { text: 'UUID', link: '/reference/uuid' },
      { text: 'ShortId', link: '/reference/short-id' },
    ],
  },
  {
    text: 'Time',
    collapsed: true,
    items: [
      { text: 'Timestamp', link: '/reference/timestamp' },
      { text: 'TimestampInterval', link: '/reference/timestamp-interval' },
      { text: 'CalendarDay', link: '/reference/calendar-day' },
      { text: 'Duration', link: '/reference/duration' },
      { text: 'Hour', link: '/reference/hour' },
      { text: 'Day', link: '/reference/day' },
      { text: 'DayOfWeek', link: '/reference/day-of-week' },
      { text: 'Month', link: '/reference/month' },
      { text: 'MonthOfYear', link: '/reference/month-of-year' },
      { text: 'Year', link: '/reference/year' },
    ],
  },
  {
    text: 'Coordinates',
    collapsed: true,
    items: [
      { text: 'Latitude', link: '/reference/latitude' },
      { text: 'Longitude', link: '/reference/longitude' },
      { text: 'Coordinates', link: '/reference/coordinates' },
    ],
  },
  {
    text: 'Hashes',
    collapsed: true,
    items: [
      { text: 'Hash', link: '/reference/hash' },
      { text: 'MD5Hash', link: '/reference/md5-hash' },
      { text: 'SHA256Hash', link: '/reference/sha256-hash' },
      { text: 'SHA512Hash', link: '/reference/sha512-hash' },
    ],
  },
  {
    text: 'Media and collections',
    collapsed: true,
    items: [
      { text: 'Media', link: '/reference/media' },
      { text: 'UniqueObjectArray', link: '/reference/unique-object-array' },
    ],
  },
  {
    text: 'Crypto helpers',
    collapsed: true,
    items: [
      { text: 'Crypto notes', link: '/reference/crypto-notes' },
      { text: 'Key', link: '/reference/key' },
      { text: 'PrivateKey', link: '/reference/private-key' },
      { text: 'PublicKey', link: '/reference/public-key' },
      { text: 'KeyPair', link: '/reference/key-pair' },
      { text: 'SymmetricKey', link: '/reference/symmetric-key' },
      { text: 'Signature', link: '/reference/signature' },
      { text: 'EncryptedPrivateKey', link: '/reference/encrypted-private-key' },
      { text: 'EncryptedPayload', link: '/reference/encrypted-payload' },
      { text: 'AsymmetricEncryptedPayload', link: '/reference/asymmetric-encrypted-payload' },
      { text: 'SymmetricEncryptedPayload', link: '/reference/symmetric-encrypted-payload' },
      { text: 'EncryptedKeyPair', link: '/reference/encrypted-key-pair' },
    ],
  },
];

export default defineConfig({
  lang: 'en-US',
  title: 'Value Objects',
  description: 'Documentation for @haskou/value-objects.',
  base: '/value-objects/',
  lastUpdated: true,
  cleanUrls: true,

  head: [
    ['meta', { name: 'theme-color', content: '#3f6ee8' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Value Objects' }],
    ['meta', { property: 'og:description', content: 'Documentation for @haskou/value-objects.' }],
  ],

  themeConfig: {
    logo: { src: '/logo.svg', alt: 'Value Objects' },
    siteTitle: 'Value Objects',

    nav: [
      { text: 'Guide', link: '/getting-started/introduction' },
      { text: 'Reference', link: '/reference/' },
      { text: 'Agent skill', link: '/guides/agent-skill' },
      { text: 'npm', link: 'https://www.npmjs.com/package/@haskou/value-objects' },
    ],

    sidebar: {
      '/getting-started/': [
        {
          text: 'Getting started',
          items: [
            { text: 'Introduction', link: '/getting-started/introduction' },
            { text: 'Installation', link: '/getting-started/installation' },
            { text: 'Basic usage', link: '/getting-started/basic-usage' },
          ],
        },
        {
          text: 'Guides',
          items: [
            { text: 'Custom value objects', link: '/guides/custom-value-objects' },
            { text: 'Error handling', link: '/guides/error-handling' },
            { text: 'Serialization', link: '/guides/serialization' },
            { text: 'Null object', link: '/guides/null-object' },
            { text: 'Release flow', link: '/guides/release-flow' },
            { text: 'Agent skill', link: '/guides/agent-skill' },
          ],
        },
      ],
      '/guides/': [
        {
          text: 'Guides',
          items: [
            { text: 'Custom value objects', link: '/guides/custom-value-objects' },
            { text: 'Error handling', link: '/guides/error-handling' },
            { text: 'Serialization', link: '/guides/serialization' },
            { text: 'Null object', link: '/guides/null-object' },
            { text: 'Release flow', link: '/guides/release-flow' },
            { text: 'Agent skill', link: '/guides/agent-skill' },
          ],
        },
        ...referenceSidebar,
      ],
      '/reference/': referenceSidebar,
    },

    outline: {
      level: [2, 3],
      label: 'On this page',
    },

    search: {
      provider: 'local',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/haskou/value-objects' },
    ],

    editLink: {
      pattern: 'https://github.com/haskou/value-objects/edit/master/docs/:path',
      text: 'Edit this page on GitHub',
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © Haskou',
    },
  },
});
