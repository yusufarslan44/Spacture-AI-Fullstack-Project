<template>
  <header>
    <div class="header-container">
      <div class="logo-section group">
        <div class="logo-wrapper">
          <div class="logo-glow"></div>
          <div class="logo-box">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="logo-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <div class="title-wrapper">
          <h1 class="app-title">
            Spacture
            <span class="app-title-highlight">AI</span>
          </h1>
          <p class="app-subtitle">Video Intelligence Platform</p>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* Header Styling */
header {
  position: sticky;
  top: 0;
  z-index: 50;
  width: 100%;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  background: linear-gradient(
    to bottom,
    rgba(15, 23, 42, 0.4),
    rgba(15, 23, 42, 0.2)
  );
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.header-container {
  max-width: 80rem;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@media (min-width: 768px) {
  header {
    padding: 1.25rem 2.5rem;
  }
}

/* Logo Section */
.logo-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  user-select: none;
}

.logo-wrapper {
  position: relative;
}

.logo-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, #22d3ee, #a855f7, #ec4899);
  border-radius: 1rem;
  filter: blur(12px);
  opacity: 0.6;
  transition: all 0.5s;
}

.group:hover .logo-glow {
  opacity: 1;
  filter: blur(16px);
}

.logo-box {
  position: relative;
  background: linear-gradient(to bottom right, #1e293b, #0f172a);
  padding: 0.75rem;
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.group:hover .logo-box {
  transform: scale(1.05);
}

.logo-icon {
  width: 1.75rem;
  height: 1.75rem;
  color: white;
}

/* Title Typography */
.title-wrapper {
  display: flex;
  flex-direction: column;
}

.app-title {
  font-size: 1.5rem;
  font-weight: 900;
  letter-spacing: -0.025em;
  background: linear-gradient(to right, white, #cffafe, #cbd5e1);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin: 0;
  line-height: 1;
}

@media (min-width: 768px) {
  .app-title {
    font-size: 1.875rem;
  }
}

.app-title-highlight {
  background: linear-gradient(to right, #22d3ee, #a855f7);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.app-subtitle {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
  letter-spacing: 0.025em;
  margin: 0.25rem 0 0 0;
  display: none;
}

@media (min-width: 768px) {
  .app-subtitle {
    display: block;
  }
}
</style>
