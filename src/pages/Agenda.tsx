import { PageShell } from '../components/layout/PageShell'
export function Agenda({ direction }: { direction: number }) {
  return <PageShell direction={direction}><div className="p-4 text-text">Agenda</div></PageShell>
}
