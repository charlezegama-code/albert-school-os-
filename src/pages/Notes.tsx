import { PageShell } from '../components/layout/PageShell'
export function Notes({ direction }: { direction: number }) {
  return <PageShell direction={direction}><div className="p-4 text-text">Notes</div></PageShell>
}
