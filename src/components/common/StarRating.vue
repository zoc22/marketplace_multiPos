<template>
  <div class="flex items-center space-x-1" role="img" :aria-label="'Rating: ' + rating + ' out of 5 stars'">
    <button
      v-for="star in 5"
      :key="star"
      type="button"
      :disabled="readonly"
      @click="$emit('update:rating', star)"
      class="p-1 transition focus:outline-none focus:ring-1 focus:ring-emerald-500"
      :class="readonly ? 'cursor-default' : 'hover:scale-110'"
      :aria-label="readonly ? undefined : 'Rate ' + star + ' stars out of 5'"
    >
      <StarIcon 
        class="h-6 w-6" 
        :class="star <= rating ? 'fill-amber-500 text-amber-500' : 'text-[#4A4A4A]'" 
        aria-hidden="true" 
      />
    </button>
  </div>
</template>

<script setup>
import { StarIcon } from '@heroicons/vue/24/outline';

defineProps({
  rating: { type: Number, default: 5 },
  readonly: { type: Boolean, default: true }
});

defineEmits(['update:rating']);
</script>
