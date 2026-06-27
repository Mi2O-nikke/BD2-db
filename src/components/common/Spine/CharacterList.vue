<template>
  <div id="l2dsearchbox" :class="checkMobile()" v-show="!market.live2d.hideUI">
    <n-card size="small" :bordered="false">
      <n-input type="text" placeholder="Name or Group" v-model:value="name_filter" :clearable="true"></n-input>
      <button @click="toogleGroupExpand()" class="icon-btn">
        <img src="/assets/images/sprite/si_c907_00_s.png" alt="Toggle Expand" />
      </button>
    </n-card>
    <n-scrollbar>
      <n-list hoverable :show-divider="false">
        <n-list-item v-for="[group, items] in visibleGroups" :key="group" @click="toggleExpand(group)">
          <n-h5 v-if="group">{{ group }}</n-h5>

          <n-list v-if="groupExpansions.find((g) => g.name === group)?.isExpanded">
            <n-list-item v-for="character in items" :key="character.id" @click.stop="changeSpine(character)">
              <template #prefix>
                <img :src="getSiIcon(character.id)" class="si_img" loading="lazy" />
              </template>

              <n-h5>{{ character.name }}</n-h5>
            </n-list-item>
          </n-list>
        </n-list-item>
      </n-list>
    </n-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { useMarket } from '@/stores/market'
import { computed, onMounted, ref } from 'vue'
import { globalParams } from '@/utils/enum/globalParams'
import type { live2d_interface } from '@/utils/interfaces/live2d'
import { Group } from '@vicons/carbon'

const market = useMarket()
const name_filter = ref('')

// eslint-disable-next-line no-redeclare
interface Group {
  name: string
  isExpanded: boolean
}

const groups = ref(new Set<string>())

const groupExpansions = ref<Group[]>([])

const toggleExpand = (name: string) => {
  const index = groupExpansions.value.findIndex((group) => group.name === name)
  if (index !== -1) {
    groupExpansions.value.forEach((g, i) => {
      g.isExpanded = i === index ? !g.isExpanded : false
    })
  } else {
    groupExpansions.value.push({ name, isExpanded: true })
  }
}

const toogleGroupExpand = () => {
  // Check if all groups are expanded
  const allExpanded = groupExpansions.value.every((g) => g.isExpanded)
  // If all are expanded, collapse all; otherwise expand all
  groupExpansions.value.forEach((g) => (g.isExpanded = !allExpanded))
}

const getGroupItems = (name: string) => {
  if (name === '_') {
    return market.live2d.filtered_l2d_Array.filter((models) => models.group === undefined)
  } else {
    return market.live2d.filtered_l2d_Array.filter((models) => models.group === name)
  }
}

const visibleGroups = computed(() => {
  const filter = name_filter.value.trim().toLowerCase()

  const map = new Map<string, live2d_interface[]>()

  for (const c of market.live2d.filtered_l2d_Array) {
    // Search by name OR group
    if (filter) {
      const matchesName = c.name.toLowerCase().includes(filter)
      const matchesGroup = (c.group || '').toLowerCase().includes(filter)
      if (!matchesName && !matchesGroup) continue
    }

    const g = c.group || '_'
    if (!map.has(g)) map.set(g, [])
    map.get(g)!.push(c)
  }

  return [...map.entries()].sort(([a], [b]) => {
    const rank = (g: string) => {
      if (g === '_') return 1
      if (g.startsWith('__')) return 3
      if (g.startsWith('_')) return 2
      return 0
    }

    const ra = rank(a)
    const rb = rank(b)

    if (ra !== rb) return ra - rb

    return a.localeCompare(b)
  })
})

onMounted(() => {
  if (market.live2d.filtered_l2d_Array.length === 0) {
    market.live2d.filter()
  }

  for (const character of market.live2d.filtered_l2d_Array) {
    groups.value.add(character.group || '_')
    groupExpansions.value.push({ name: character.group || '_', isExpanded: true })
  }
})

const getSiIcon = (id: string) => {
  return globalParams.NIKKE_DB + globalParams.PATH_SPRITE_1 + id + globalParams.PATH_SPRITE_2
}

const checkMobile = () => {
  return market.globalParams.isMobile ? 'mobile' : 'computer'
}

const changeSpine = (character: live2d_interface) => {
  market.live2d.change_current_spine(character)
}
</script>

<style scoped lang="less">
@import '@/utils/style/global_variables.less';
.computer {
  position: absolute;
  width: 420px;
  left: 20px;
  top: 20px;
  height: calc(85vh - 0px);
  z-index: 1000;
  pointer-events: auto;

  .n-list {
    // min-height: calc(85vh - 120px);
    user-select: none;

    .n-list-item {
      padding: 5px 10px;
      border-top: #18181c 1px solid;
      border-bottom: #18181c 1px solid;

      .si_img {
        height: 50px;
      }

      &:hover {
        cursor: pointer;
        border-top: @naive-green 1px solid;
        border-bottom: @naive-green 1px solid;
      }
    }
  }

  .n-card {
    height: 60px;
    border-top: 1px solid @naive-green;
    border-right: 1px solid @naive-green;
    border-radius: 10px;
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
    :deep(.n-card__content) {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 10px;
      height: 100%;
      padding: 0 12px;
    }

    :deep(.n-input) {
      flex: 1;
    }
  }

  .n-card,
  .n-list {
    border-left: 1px solid @naive-green;
  }
}

.icon-btn {
  width: 8px;
  height: 8px;
  padding: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 25px;
    height: 25px;
    object-fit: contain;
    display: block;
  }
}

.mobile {
  .n-list-item,
  .n-card {
    border-top: @naive-green 1px solid;

    .si_img {
      height: 50px;
    }
  }
}
</style>
