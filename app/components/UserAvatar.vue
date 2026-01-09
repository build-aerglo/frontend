<template>
  <div :class="wrapperClass">
    <img 
      v-if="profileImageUrl" 
      :src="profileImageUrl" 
      :alt="altText"
      class="avatar-image"
    />
    <div 
      v-else
      class="avatar-initials"
      :style="avatarStyle"
    >
      {{ initials }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  size?: number;
  class?: string; // Add this
}

const props = withDefaults(defineProps<Props>(), {
  firstName: '',
  lastName: '',
  profileImageUrl: '',
  size: 40
});

// Merge custom classes with base class
const wrapperClass = computed(() => {
  return props.class || 'user-avatar';
});

const initials = computed(() => {
  const first = props.firstName?.[0]?.toUpperCase() || '';
  const last = props.lastName?.[0]?.toUpperCase() || '';
  return first + last || 'U';
});

const altText = computed(() => {
  return `${props.firstName} ${props.lastName}`.trim() || 'User';
});

const backgroundColor = computed(() => {
  const name = `${props.firstName}${props.lastName}`;
  const colors = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Blue
    '#96CEB4', // Green
    '#FFEAA7', // Yellow
    '#DFE6E9', // Gray
    '#A29BFE', // Purple
    '#FD79A8'  // Pink
  ];
  
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
});

const avatarStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  backgroundColor: backgroundColor.value,
  fontSize: `${props.size / 2.5}px`
}));
</script>

<style scoped>
.user-avatar {
  display: inline-block;
}

.avatar-image {
  border-radius: 50%;
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.avatar-initials {
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  user-select: none;
  width: 100%;
  height: 100%;
}
</style>