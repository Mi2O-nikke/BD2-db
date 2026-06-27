<template>
  <div class="flexbox main-bg main-box-shadow">
    <span class="routes">
      <RouterLink
        v-for="route in props.routes"
        :to="{name: route.path}"
        class="redirect"
        :key="'route' + route.path"
      >
        {{ route.text }}
      </RouterLink>

<!--      <VisitorCounter display="PC" style="margin-left: auto"/>-->

    </span>
  </div>
</template>

<script setup lang="ts">
import { GithubFilled } from '@vicons/antd'
import { globalParams } from '@/utils/enum/globalParams'

import { type route2DisplayInterface } from '@/components/common/Header/routes2Display'
import VisitorCounter from '@/components/common/Header/VisitorCounter.vue'

const props = defineProps<{
  routes: route2DisplayInterface[]
}>()

const sendToGithub = () => {
  window.open(globalParams.GITHUB, '_blank')
}
</script>

<style lang="less" scoped>
.flexbox {
  height: 100px;
  display: flex;
  flex-direction: row;
  width: 100%;
  position: relative;
  top: 30px;
  left: 0px;
  z-index: 10;

  span {
    width: 0%;
    flex: 1;

    &.routes {
      flex: 50 0 0;

      align-items: center;
      margin-top: 30px;

      text-align: right;
      .redirect {
        width: 100vw;
        margin-right: 25px;
      }
    }
  }

  .logo {
    margin: 0 50px 0 15px;
    height: 100px;
    user-select: none;
  }
}
.githubwrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 25px;
  .github {
    color: white;
    height: 50%;
    cursor: pointer;
  }
}
</style>
