<template>
  <div class="fixture-root">
    <section data-parity-id="forced-colors-cluster" class="fixture-card">
      <p class="forced-colors-title">Forced Colors Cluster</p>
      <button type="button" class="forced-colors-button">Primary action</button>

      <div class="forced-colors-field">
        <label for="forced-owner-input">Owner</label>
        <div class="forced-colors-invalid">
          <input id="forced-owner-input" value="" readonly />
          <span class="forced-colors-invalid__icon" aria-hidden="true">▲</span>
        </div>
        <p class="forced-colors-field__description">Required in forced colors</p>
      </div>

      <div class="forced-colors-switch">
        <span class="forced-colors-switch__track" aria-hidden="true">
          <span class="forced-colors-switch__thumb" />
        </span>
        <span>Alerts</span>
      </div>

      <div class="forced-colors-status">
        <span class="forced-colors-status__dot" aria-hidden="true" />
        <span>Healthy</span>
      </div>

      <div class="native-control">
        <label for="forced-native-input">Native input</label>
        <input id="forced-native-input" value="Native surface" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.fixture-root {
  min-height: 100vh;
  background: #f5f5f5;
  color: #1f1f1f;
  font-family: Arial, sans-serif;
  padding: 24px;
}

.fixture-card {
  align-items: stretch;
  background: #ffffff;
  border: 1px solid #d8d8d8;
  border-radius: 8px;
  display: grid;
  gap: 12px;
  margin: 0 auto;
  max-width: 620px;
  padding: 16px;
}

.native-control {
  display: grid;
  gap: 6px;
}

.forced-colors-title {
  color: #222222;
  font-size: 14px;
  line-height: 21px;
  margin: 0;
}

.forced-colors-button {
  align-items: center;
  background: #000000;
  border: 1px solid #000000;
  border-radius: 17px;
  color: #ffffff;
  cursor: default;
  display: inline-flex;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  forced-color-adjust: none;
  justify-content: center;
  line-height: 18px;
  min-block-size: 32px;
  padding: 0 14px;
}

.forced-colors-field {
  display: grid;
  gap: 6px;
}

.forced-colors-field label {
  color: #222222;
  font-size: 14px;
  line-height: 21px;
}

.forced-colors-invalid {
  inline-size: 192px;
  position: relative;
}

.forced-colors-invalid input {
  border: 1px solid #2f2f2f;
  border-radius: 6px;
  box-sizing: border-box;
  font-family: inherit;
  font-size: 14px;
  inline-size: 100%;
  line-height: 20px;
  min-block-size: 32px;
  padding: 0 30px 0 10px;
}

.forced-colors-invalid__icon {
  color: #000000;
  font-size: 13px;
  inset-block-start: 8px;
  inset-inline-end: 10px;
  line-height: 1;
  position: absolute;
}

.forced-colors-field__description {
  color: #222222;
  font-size: 14px;
  line-height: 21px;
  margin: 0;
}

.forced-colors-switch {
  align-items: center;
  color: #222222;
  display: inline-flex;
  gap: 10px;
}

.forced-colors-switch__track {
  background: #4f4483;
  block-size: 14px;
  border-radius: 7px;
  forced-color-adjust: none;
  inline-size: 26px;
  position: relative;
}

.forced-colors-switch__thumb {
  background: #ffffff;
  block-size: 10px;
  border-radius: 50%;
  inset-block-start: 2px;
  inset-inline-end: 2px;
  inline-size: 10px;
  position: absolute;
}

.forced-colors-status {
  align-items: center;
  color: #222222;
  display: inline-flex;
  gap: 10px;
}

.forced-colors-status__dot {
  background: #2ea982;
  block-size: 9px;
  border-radius: 50%;
  forced-color-adjust: none;
  inline-size: 9px;
}

.native-control input {
  border: 1px solid #bdbdbd;
  border-radius: 6px;
  box-sizing: border-box;
  font-family: inherit;
  font-size: 14px;
  inline-size: 100%;
  line-height: 20px;
  min-height: 32px;
  padding: 0 10px;
}
</style>
