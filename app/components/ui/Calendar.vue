<script setup lang="ts">
interface DayCell {
  date: Date
  isCurrentMonth: boolean
}

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const today = new Date()
const weekdayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const monthLabels = Array.from({ length: 12 }, (_, i) => new Date(2000, i, 1).toLocaleDateString('en-US', { month: 'short' }))

const initialDate = props.modelValue ? new Date(props.modelValue) : today
const viewYear = ref(initialDate.getFullYear())
const viewMonth = ref(initialDate.getMonth())
const isMonthPickerOpen = ref(false)

const monthLabel = computed(() =>
  new Date(viewYear.value, viewMonth.value, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
)

const days = computed<DayCell[]>(() => {
  const firstDay = new Date(viewYear.value, viewMonth.value, 1)
  const startWeekday = (firstDay.getDay() + 6) % 7
  const daysInMonth = new Date(viewYear.value, viewMonth.value + 1, 0).getDate()
  const daysInPrevMonth = new Date(viewYear.value, viewMonth.value, 0).getDate()

  const cells: DayCell[] = []

  for (let i = startWeekday - 1; i >= 0; i--) {
    cells.push({ date: new Date(viewYear.value, viewMonth.value - 1, daysInPrevMonth - i), isCurrentMonth: false })
  }

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ date: new Date(viewYear.value, viewMonth.value, day), isCurrentMonth: true })
  }

  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1]!.date
    cells.push({ date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1), isCurrentMonth: false })
  }

  return cells
})

function toISODate (date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function isSameDay (a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function isSelected (date: Date): boolean {
  return !!props.modelValue && isSameDay(date, new Date(props.modelValue))
}

function isToday (date: Date): boolean {
  return isSameDay(date, today)
}

function prevMonth () {
  if (viewMonth.value === 0) {
    viewMonth.value = 11
    viewYear.value -= 1
  }
  else {
    viewMonth.value -= 1
  }
}

function nextMonth () {
  if (viewMonth.value === 11) {
    viewMonth.value = 0
    viewYear.value += 1
  }
  else {
    viewMonth.value += 1
  }
}

function prevYear () {
  viewYear.value -= 1
}

function nextYear () {
  viewYear.value += 1
}

function goPrev () {
  if (isMonthPickerOpen.value) prevYear()
  else prevMonth()
}

function goNext () {
  if (isMonthPickerOpen.value) nextYear()
  else nextMonth()
}

function toggleMonthPicker () {
  isMonthPickerOpen.value = !isMonthPickerOpen.value
}

function selectMonth (monthIndex: number) {
  viewMonth.value = monthIndex
  isMonthPickerOpen.value = false
}

function selectDate (date: Date) {
  emit('update:modelValue', toISODate(date))
}

function selectToday () {
  viewYear.value = today.getFullYear()
  viewMonth.value = today.getMonth()
  isMonthPickerOpen.value = false
  emit('update:modelValue', toISODate(today))
}

function clear () {
  emit('update:modelValue', '')
}
</script>

<template>
  <div
    class="w-72 rounded-xl border border-gray-100 bg-white p-4 shadow-elevation-3"
    @click.stop
  >
    <div class="mb-3 flex items-center justify-between">
      <button
        type="button"
        class="flex cursor-pointer items-center gap-1 text-input-label text-black"
        @click="toggleMonthPicker"
      >
        {{ monthLabel }}
        <Icon
          name="custom:alt-arrow-right"
          class="size-3.5 transition-transform"
          :class="isMonthPickerOpen ? '-rotate-90' : 'rotate-90'"
        />
      </button>
      <div class="flex flex-col">
        <button
          type="button"
          :aria-label="isMonthPickerOpen ? 'Previous year' : 'Previous month'"
          class="cursor-pointer text-gray-400 hover:text-gray-700"
          @click="goPrev"
        >
          <Icon
            name="custom:alt-arrow-left"
            class="size-4 rotate-90"
          />
        </button>
        <button
          type="button"
          :aria-label="isMonthPickerOpen ? 'Next year' : 'Next month'"
          class="cursor-pointer text-gray-400 hover:text-gray-700"
          @click="goNext"
        >
          <Icon
            name="custom:alt-arrow-right"
            class="size-4 rotate-90"
          />
        </button>
      </div>
    </div>

    <div
      v-if="isMonthPickerOpen"
      class="grid grid-cols-3 gap-2"
    >
      <button
        v-for="(month, index) in monthLabels"
        :key="month"
        type="button"
        class="cursor-pointer rounded-lg py-2 text-body-s"
        :class="index === viewMonth ? 'bg-primary-600 text-white' : 'text-black hover:bg-gray-50'"
        @click="selectMonth(index)"
      >
        {{ month }}
      </button>
    </div>

    <div
      v-else
      class="grid grid-cols-7 gap-1 text-center"
    >
      <span
        v-for="(day, index) in weekdayLabels"
        :key="index"
        class="text-body-xs text-gray-400"
      >{{ day }}</span>

      <button
        v-for="cell in days"
        :key="cell.date.toISOString()"
        type="button"
        class="flex size-8 cursor-pointer items-center justify-center rounded-full text-body-s"
        :class="[
          !cell.isCurrentMonth ? 'text-gray-300' : 'text-black',
          isSelected(cell.date) ? 'bg-primary-600 text-white' : '',
          isToday(cell.date) && !isSelected(cell.date) ? 'border border-primary-600' : '',
        ]"
        @click="selectDate(cell.date)"
      >
        {{ cell.date.getDate() }}
      </button>
    </div>

    <div class="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
      <button
        type="button"
        class="cursor-pointer text-body-xs text-primary-600"
        @click="clear"
      >
        Clear
      </button>
      <button
        type="button"
        class="cursor-pointer text-body-xs text-primary-600"
        @click="selectToday"
      >
        Today
      </button>
    </div>
  </div>
</template>
