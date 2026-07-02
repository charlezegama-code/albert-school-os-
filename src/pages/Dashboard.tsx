import { PageShell } from '../components/layout/PageShell'
export function Dashboard({ direction }: { direction: number }) {
  return <PageShell direction={direction}><div className="p-4 text-text">Dashboard</div></PageShell>
}
