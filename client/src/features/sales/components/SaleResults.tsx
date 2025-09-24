import usePrivileges from '@/hooks/usePrivilege'
import useSalesPage from '../hooks/useSalesPage'

const SaleResults = () => {
  const { queryTotalCost, queryTotalRevenue, queryTotalProfit } = useSalesPage()
  const { costPrivilege } = usePrivileges()
  return (
    <>
      <hr className="m-4" />
      {costPrivilege.canRead() && (
        <>
          <span>total cost: </span>
          <span>{queryTotalCost}</span>
          <br />
        </>
      )}
      <span>total Revenue: </span>
      <span>{queryTotalRevenue}</span>
      {costPrivilege.canRead() && (
        <>
          <br />
          <span>total profit: </span>
          <span>{queryTotalProfit}</span>{' '}
        </>
      )}
    </>
  )
}

export default SaleResults
