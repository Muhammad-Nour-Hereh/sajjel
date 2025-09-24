import { ArrowLeftCircle, ArrowRightCircle } from 'lucide-react'
import useSalesPage from '../hooks/useSalesPage'

const SalesPageHeader = () => {
  const { date, setDate, changeDate } = useSalesPage()

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-6 space-y-4">
      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          <ArrowLeftCircle
            className="cursor-pointer"
            onClick={() => changeDate(-1)}
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
          <ArrowRightCircle
            className="cursor-pointer"
            onClick={() => changeDate(1)}
          />
        </div>
        <span className="font-semibold text-2xl">
          بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ
        </span>
        <div className="grid gap-1">
          <span>
            open time: <input type="time" defaultValue="11:11" />
          </span>
          <span>
            close time: <input type="time" defaultValue="11:11" />
          </span>
        </div>
      </div>
    </div>
  )
}

export default SalesPageHeader
