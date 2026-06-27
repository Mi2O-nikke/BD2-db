<template>
  <div class="left-sidebar">
    <div class="sidebar-header">
      <h2>Characters</h2>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search..."
        class="search-input"
      />
    </div>
    <div class="placeholder-content">
      <p>Character list coming in Phase 2</p>
      <p style="font-size: 12px; color: #666;">Showing 5 placeholder characters</p>
      <div v-for="i in 5" :key="i" class="placeholder-item">
        <div class="placeholder-icon"></div>
        <div class="placeholder-name">Character {{ i }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const searchQuery = ref('')
</script>

<style scoped lang="scss">
$bg-primary: #1a1a1f;
$bg-secondary: #2a2a2f;
$border-color: #2a2a2f;
$text-primary: #e0e0e0;
$accent: #00ff00;

.left-sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: $bg-primary;
  overflow-y: auto;

  .sidebar-header {
    padding: 16px;
    border-bottom: 1px solid $border-color;
    flex-shrink: 0;

    h2 {
      margin: 0 0 12px 0;
      font-size: 18px;
      color: $text-primary;
    }

    .search-input {
      width: 100%;
      padding: 8px 12px;
      background: $bg-secondary;
      border: 1px solid #3a3a3f;
      color: $text-primary;
      border-radius: 4px;
      font-size: 14px;

      &::placeholder {
        color: #666;
      }

      &:focus {
        outline: none;
        border-color: $accent;
        box-shadow: 0 0 0 2px rgba(0, 255, 0, 0.1);
      }
    }
  }

  .placeholder-content {
    padding: 16px;
    flex: 1;
    overflow-y: auto;

    p {
      margin: 0 0 12px 0;
      font-size: 14px;
      color: $text-primary;
    }

    .placeholder-item {
      display: flex;
      gap: 12px;
      padding: 12px;
      margin-bottom: 8px;
      background: $bg-secondary;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.2s;

      &:hover {
        background: #3a3a3f;
      }

      .placeholder-icon {
        width: 40px;
        height: 40px;
        background: #4a4a4f;
        border-radius: 4px;
        flex-shrink: 0;
      }

      .placeholder-name {
        padding-top: 8px;
        color: #999;
        font-size: 12px;
      }
    }
  }
}
</style>
