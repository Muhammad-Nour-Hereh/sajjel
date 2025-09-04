import { InlineTextInput } from '@/components/common/InlineTextInput'
import InlineNum from '@/components/inline/InlineNum'
import { useState } from 'react'

const ComponentsPage = () => {
  const [numberValue, setNumberValue] = useState(42)
  const [value, setValue] = useState('abc')
  return (
    <div>
      <p>{numberValue}</p>
      <InlineNum
        value={numberValue}
        setValue={setNumberValue}
        onChange={(val) => console.log(val)}
      />

      {/* <InlineTextInput value={value} onChange={setValue} /> */}
      <input type="text" value={'a'}/>
    </div>
  )
}

export default ComponentsPage
