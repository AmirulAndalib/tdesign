<template>
  <t-popup hide-empty-popup :attach="handleAttach" :visible="isThemeTabVisible" @visible-change="handleVisibleChange">
    <div
      class="dock"
      :style="{
        zIndex: 9999,
        width: operationWidth,
        transition: 'width .3s',
        bottom: `${dockY}px`,
        left: `${dockX}px`,
        transform: 'translateX(-50%)',
        userSelect: isDragging ? 'none' : 'auto',
      }"
      @mousedown="dragStart"
    >
      <div class="dock__theme-tab" :style="{ height: !isThemeTabVisible ? '0px' : '140px' }">
        <transition name="fade">
          <recommend-themes
            @changeTabTheme="handleChangeTabTheme"
            v-if="isThemeTabVisible && isThemeTabContentDisplay"
            :currentTheme="currentTheme"
          />
        </transition>
      </div>
      <div class="dock__operation">
        <div
          ref="btn"
          class="generator-btn"
          @click="handleClickTheme"
          @mouseleave="handleLeaveTheme"
          :style="{
            width: generateBtnWidth,
            marginRight: '4px',
            transition: 'width .3s',
          }"
        >
          <t-button variant="outline" shape="square" size="large">
            <template #icon>
              <palette-svg />
            </template>
            <div v-if="!isCustomizeDrawerVisible" style="margin-left: 8px">
              {{ isEn ? currentTheme.enName : currentTheme.name }}
            </div>
          </t-button>
        </div>
        <div
          class="generator-btn"
          @click="handleClickCustomize"
          :style="{
            width: !isCustomizeDrawerVisible ? '48px' : '216px',
            margin: '0 4px',
            transition: 'width .3s',
          }"
        >
          <t-button variant="outline" shape="square" size="large">
            <template #icon>
              <adjust-svg />
            </template>
            <div v-if="isCustomizeDrawerVisible" style="margin-left: 8px">
              {{ lang.dock.adjustText }}
            </div>
          </t-button>
        </div>
        <div v-if="showSetting" class="setting-btn" :style="{ width: '48px', marginLeft: '4px' }">
          <t-button variant="outline" shape="square" size="large" @click="triggerSettingDrawer">
            <template #icon>
              <setting-svg />
            </template>
          </t-button>
        </div>
        <div
          v-if="isCustomizeDrawerVisible || isThemeTabVisible"
          class="export-btn"
          @click="handleDownload"
          :style="{ width: '48px', margin: '0 4px' }"
        >
          <t-button variant="outline" shape="square" size="large">
            <template #icon>
              <download-svg />
            </template>
          </t-button>
        </div>
        <div
          v-if="isCustomizeDrawerVisible || isThemeTabVisible"
          class="recover-btn"
          :style="{ width: '48px', marginLeft: '4px' }"
        >
          <t-popconfirm
            :content="lang.dock.recoverConfirm"
            :theme="null"
            :popup-props="{
              attach: handleAttach,
            }"
            @confirm="recoverTheme"
          >
            <t-button variant="outline" shape="square" size="large">
              <template #icon>
                <recover-svg />
              </template>
            </t-button>
          </t-popconfirm>
        </div>
      </div>
    </div>
  </t-popup>
</template>

<script>
import { MessagePlugin, Button as TButton, Popconfirm as TPopconfirm, Popup as TPopup } from 'tdesign-vue';

import RecommendThemes from '../recommend-themes/index.vue';

import AdjustSvg from './svg/AdjustSvg.vue';
import DownloadSvg from './svg/DownloadSvg.vue';
import PaletteSvg from './svg/PaletteSvg.vue';
import RecoverSvg from './svg/RecoverSvg.vue';
import SettingSvg from './svg/SettingSvg.vue';

import langMixin from '../common/i18n/mixin';
import {
  clearLocalTheme,
  CUSTOM_THEME_TEXT,
  DEFAULT_THEME,
  exportCustomTheme,
  generateNewTheme,
  getBuiltInThemes,
  getOptionFromLocal,
} from '../common/Themes';
import { handleAttach } from '../common/utils';

export default {
  name: 'DockIndex',
  components: {
    TButton,
    TPopup,
    TPopconfirm,
    RecommendThemes,
    DownloadSvg,
    RecoverSvg,
    PaletteSvg,
    AdjustSvg,
    SettingSvg,
  },
  props: {
    drawerVisible: { type: [Boolean, Number] },
    showSetting: { type: [Boolean, String] },
  },
  inject: ['device'],
  mixins: [langMixin],
  data() {
    return {
      isThemeTabVisible: false,
      isCustomizeDrawerVisible: false,
      currentTheme: getOptionFromLocal('color') ?? DEFAULT_THEME.value,
      isThemeTabContentDisplay: false,
      dockY: null,
      dockX: 0,
      startY: null,
      startX: null,
      isDragging: false,
    };
  },
  computed: {
    operationWidth() {
      if (!this.showSetting) {
        if (this.isThemeTabVisible || this.isCustomizeDrawerVisible) return '400px';
        return '256px';
      } else {
        if (this.isThemeTabVisible || this.isCustomizeDrawerVisible) return '456px';
        return '312px';
      }
    },
    generateBtnWidth() {
      if (this.isThemeTabVisible) return '216px';
      if (this.isCustomizeDrawerVisible) return '48px';
      return '184px';
    },
  },
  watch: {
    drawerVisible(v) {
      if (!v) this.isCustomizeDrawerVisible = false;
    },
    isThemeTabVisible(v) {
      setTimeout(() => {
        this.isThemeTabContentDisplay = v;
      }, 300);
    },
  },
  mounted() {
    this.dockY = 24;
    this.dockX = innerWidth / 2;
    this.setupStyleChangeObserver();
  },
  methods: {
    dragStart(e) {
      this.startY = e.clientY;
      this.startX = e.clientX;
      this.isDragging = true;

      document.addEventListener('mouseup', this.handleMouseup, true);
      document.addEventListener('mousemove', this.handleMousemove, true);
    },
    handleMousemove(e) {
      if (!this.isDragging) return false;
      // 获取拖拽移动的距离
      const movedY = this.startY - e.clientY;
      const movedX = this.startX - e.clientX;
      this.startY = e.clientY;
      this.startX = e.clientX;

      const newY = this.dockY + movedY;
      const newX = this.dockX - movedX;
      if (newY > 0) this.dockY = newY;
      this.dockX = newX;
    },
    handleMouseup() {
      this.isDragging = false;
      document.removeEventListener('mouseup', this.handleMouseup, true);
      document.removeEventListener('mousemove', this.handleMousemove, true);
    },
    handleAttach,
    handleDownload() {
      exportCustomTheme(this.device);
      MessagePlugin.success(this.lang.dock.downloadTips);
    },
    triggerSettingDrawer() {
      this.$emit('click-setting');
    },
    handleLeaveTheme() {
      this.$refs.btn.classList.add('is-mouseleave');
      setTimeout(() => {
        this.$refs.btn.classList.remove('is-mouseleave');
      }, 500);
    },
    handleClickCustomize() {
      this.$emit('trigger-visible');
      this.isCustomizeDrawerVisible = true;
      this.isThemeTabVisible = false;
      if (window._horizon) {
        window._horizon.send('主题生成器自定义按钮', 'click');
      }
    },
    handleClickTheme() {
      this.isThemeTabVisible = true;
      this.isCustomizeDrawerVisible = false;
      if (window._horizon) {
        window._horizon.send('主题生成器主题按钮', 'click');
      }
    },
    handleVisibleChange(visible, ctx) {
      if (!visible && ctx.trigger === 'document' && ctx.e.target?.localName !== 'td-theme-generator') {
        this.isThemeTabVisible = visible;
      }
    },
    handleChangeTabTheme(theme) {
      this.currentTheme = theme;
      this.$emit('refresh-content');
      this.$emit('change-theme', theme);
    },
    recoverTheme() {
      generateNewTheme(DEFAULT_THEME.value, undefined, this.device);
      clearLocalTheme();
      this.currentTheme = DEFAULT_THEME;
      this.$emit('refresh-content');
    },
    setupStyleChangeObserver() {
      const styleObserver = new MutationObserver((mutationsList) => {
        mutationsList.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            const currentStyle = mutation.target.getAttribute('style');
            const brandColorMatch = currentStyle.match(/--brand-main:\s*([^;]+)/);
            if (!brandColorMatch) return;

            const mainColor = brandColorMatch[1];
            const existedTheme = getBuiltInThemes(this.device, mainColor);
            const theme = existedTheme[0] ? existedTheme[0].options[0] : CUSTOM_THEME_TEXT;

            this.currentTheme = theme;
            this.$emit('change-theme', theme);
          }
        });
      });

      styleObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['style'],
        childList: false,
        subtree: false,
      });

      this.$once('hook:beforeDestroy', () => {
        styleObserver.disconnect();
      });
    },
  },
};
</script>

<style lang="less" scoped>
@keyframes toConic {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 100% 50%;
  }
}

@keyframes toPure {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 0;
  }
}
.fade-enter-active,
.fad-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.dock {
  position: fixed;
  margin: auto;
  width: fit-content;
  background-color: var(--bg-color-theme-transparent);
  padding: 8px;
  box-sizing: border-box;
  backdrop-filter: blur(10px);
  border-radius: 32px;
  &__theme-tab {
    transition: height 0.3s;
  }
  &__operation {
    display: flex;
  }
}
.generator-btn,
.export-btn,
.setting-btn,
.recover-btn {
  border-radius: 32px;
  padding: 1px;
  background: linear-gradient(
    135deg,
    var(--theme-component-border),
    var(--theme-component-border),
    var(--theme-component-border),
    #006cfc,
    #05c4f4,
    #7ee94c
  );
  background-size: 400%;
  &.is-mouseleave {
    animation: toPure 0.5s cubic-bezier(0.38, 0, 0.24, 1);
  }
  /deep/ .t-button--variant-text:hover {
    background: var(--bg-color-container-hover);
  }
  /deep/ .t-button {
    height: 46px;
    width: 100%;
    border-radius: 24px;
    border: none;
    margin: auto;
    transition: transform 0.2s, color 0.2s;
    background-color: var(--bg-color-card);
    --ripple-color: transparent;
    color: var(--text-secondary);
  }

  &:hover {
    animation: toConic 0.5s cubic-bezier(0.38, 0, 0.24, 1) forwards;
    /deep/ .t-button {
      background-color: var(--bg-color-card);
      color: var(--text-primary);
    }
  }
}
</style>
