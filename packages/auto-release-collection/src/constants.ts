export const submodules = {
  'tdesign-vue': {
    title: '## Vue2 for Web 发布',
    changelogUrl: 'https://raw.githubusercontent.com/Tencent/tdesign-vue/refs/heads/main/CHANGELOG.md',
  },
  'tdesign-vue-next': {
    title: '## Vue3 for Web 发布',
    changelogUrl: 'https://raw.githubusercontent.com/Tencent/tdesign-vue-next/refs/heads/main/packages/tdesign-vue-next/CHANGELOG.md',
  },
  'tdesign-react': {
    title: '## React for Web 发布 ',
    changelogUrl: 'https://raw.githubusercontent.com/Tencent/tdesign-react/refs/heads/main/packages/tdesign-react/CHANGELOG.md',
  },
  'tdesign-miniprogram': {
    title: '## Miniprogram for WeChat 发布',
    changelogUrl: 'https://raw.githubusercontent.com/Tencent/tdesign-miniprogram/refs/heads/main/CHANGELOG.md',
  },
  'tdesign-mobile-vue': {
    title: '## Vue3 for Mobile 发布',
    changelogUrl: 'https://raw.githubusercontent.com/Tencent/tdesign-mobile-vue/refs/heads/main/CHANGELOG.md',
  },
  'tdesign-flutter': {
    title: '## Flutter for Mobile 发布',
    changelogUrl: 'https://raw.githubusercontent.com/Tencent/tdesign-flutter/refs/heads/main/tdesign-site/CHANGELOG.md',
  },
  'tdesign-mobile-react': {
    title: '## React for Mobile 发布',
    changelogUrl: 'https://raw.githubusercontent.com/Tencent/tdesign-mobile-react/refs/heads/main/CHANGELOG.md',
  },
  'tdesign-vue-starter': {
    title: '## Vue for Starter 发布 ',
    changelogUrl: 'https://raw.githubusercontent.com/Tencent/tdesign-vue-starter/refs/heads/main/CHANGELOG.md',
  },
  'tdesign-vue-next-starter': {
    title: '## Vue-next for Starter 发布 ',
    changelogUrl: 'https://raw.githubusercontent.com/Tencent/tdesign-vue-next-starter/refs/heads/main/CHANGELOG.md',
  },
  'tdesign-react-starter': {
    title: '## React for Starter 发布 ',
    changelogUrl: 'https://raw.githubusercontent.com/Tencent/tdesign-react-starter/refs/heads/main/CHANGELOG.md',
  },
};

export type SubmoduleItem = keyof typeof submodules;

export const submodulesKeys: SubmoduleItem[] = [
  'tdesign-vue',
  'tdesign-vue-next',
  'tdesign-react',
  'tdesign-miniprogram',
  'tdesign-mobile-vue',
  'tdesign-mobile-react',
  'tdesign-flutter',
  'tdesign-vue-starter',
  'tdesign-vue-next-starter',
  'tdesign-react-starter',
];
