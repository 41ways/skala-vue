<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import CityMap from '@/components/exercise/CityMap.vue'
import DrivingScene from '@/components/exercise/DrivingScene.vue'

const router = useRouter()

const stage = ref('map')
const city = ref(null)

const pickCity = (picked) => {
  city.value = picked
  stage.value = 'down'
  setTimeout(() => {
    stage.value = 'drive'
  }, 1700)
}

const openNav = () => {
  stage.value = 'up'
  setTimeout(() => {
    stage.value = 'map'
    city.value = null
  }, 1700)
}
</script>

<template>
  <div class="sky-drive">
    <button class="exit" @click="router.push('/')">← 대시보드</button>

    <div class="stageview">
      <CityMap v-if="stage === 'map'" @pick-city="pickCity" />
      <DrivingScene v-else-if="stage === 'drive'" :city="city" @open-nav="openNav" />

      <div v-else class="tunnel" :class="stage">
        <span v-for="n in 7" :key="n" class="cloud" :style="{ '--i': n }"></span>
        <p class="caption">
          {{ stage === 'down' ? city.name + ' 상공 진입' : '고도를 높이는 중' }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sky-drive {
  position: relative;
}

.exit {
  border: none;
  background: none;
  padding: 0;
  margin-bottom: 10px;
  font-size: 13px;
  color: #6b7a80;
  cursor: pointer;
}

.exit:hover {
  color: #1e2f33;
}

.stageview {
  position: relative;
  height: 460px;
  border-radius: 8px;
  overflow: hidden;
  background: linear-gradient(#070b1c, #16223f);
}

/* 구름을 비집고 오르내리는 구간 */
.tunnel {
  position: relative;
  height: 100%;
  overflow: hidden;
}

.cloud {
  position: absolute;
  left: calc(var(--i) * 15% - 30%);
  width: 62%;
  height: 130px;
  border-radius: 50%;
  background-color: #aab8d4;
  filter: blur(26px);
  opacity: 0.85;
}

.tunnel.down .cloud {
  animation: pass-down 1.7s cubic-bezier(0.4, 0, 0.5, 1) forwards;
  animation-delay: calc(var(--i) * 0.09s);
  top: -180px;
}

.tunnel.up .cloud {
  animation: pass-up 1.7s cubic-bezier(0.4, 0, 0.5, 1) forwards;
  animation-delay: calc(var(--i) * 0.09s);
  top: 520px;
}

@keyframes pass-down {
  from {
    transform: translateY(0) scale(0.5);
    opacity: 0;
  }
  40% {
    opacity: 0.9;
  }
  to {
    transform: translateY(660px) scale(2.6);
    opacity: 0;
  }
}

@keyframes pass-up {
  from {
    transform: translateY(0) scale(2.6);
    opacity: 0;
  }
  40% {
    opacity: 0.9;
  }
  to {
    transform: translateY(-660px) scale(0.5);
    opacity: 0;
  }
}

.caption {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  margin: 0;
  text-align: center;
  font-size: 14px;
  letter-spacing: 0.06em;
  color: #dbe4ef;
}

@media (prefers-reduced-motion: reduce) {
  .cloud {
    animation: none !important;
  }
}
</style>
