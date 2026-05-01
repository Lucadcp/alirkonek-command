type VercelResponse = { setHeader(name: string, value: string): void; json(body: unknown): void };
const demo = {
  user: { name: 'Luca', role: 'Owner' },
  today: { shift: '9:00 AM – 5:00 PM', location: 'Main Site', team: ['Maria', 'John', 'Adit'], urgent: 'Stock count by 11:00 AM' },
  tasks: [
    { id: 't1', title: 'Clean cold room', assignee: 'John', due: 'Today 3:00 PM', status: 'todo', priority: 'high' },
    { id: 't2', title: 'Stock count', assignee: 'Maria', due: 'Today 11:00 AM', status: 'doing', priority: 'urgent' },
    { id: 't3', title: 'End shift handover', assignee: 'Luca', due: 'Today 5:00 PM', status: 'todo', priority: 'normal' }
  ],
  roster: [
    { id: 's1', date: 'Today', time: '9:00–17:00', role: 'Supervisor', location: 'Main Site', confirmed: true },
    { id: 's2', date: 'Tomorrow', time: '8:00–14:00', role: 'Supervisor', location: 'Main Site', confirmed: false }
  ],
  radar: ['John has not confirmed tomorrow shift', 'Cold room task needs photo proof', 'Sunday roster has no supervisor']
};
export default function handler(_req: unknown, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return res.json(demo);
}
