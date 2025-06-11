import { reactive } from 'vue'

export const storeTable = reactive({
  headerStyleFirstElement:
    'background: #C2CED699;  border-top-left-radius: 4px; border-bottom-left-radius: 4px; font-size: 14px; font-weight: 700',
  headerStyleElements: 'background: #C2CED699;  font-size: 14px; font-weight: 700',
  alignContent: 'left' as 'left' | 'right' | 'center',
  headerStyleLastElement:
    'background: #C2CED699;  border-top-right-radius: 4px; border-bottom-right-radius: 4px; font-size: 14px; font-weight: 700',
})
