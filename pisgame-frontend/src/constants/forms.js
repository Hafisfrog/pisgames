export const medalLabels = {
  gold: 'ทอง',
  silver: 'เงิน',
  bronze: 'ทองแดง',
}

export const defaultForms = {
  team: { name: '', color: '#2563eb', description: '' },
  sport: { name: '', description: '' },
  event: {
    sport_id: '',
    name: '',
    category: '',
    gender: '',
    event_date: '',
    status: 'scheduled',
  },
  result: { event_id: '', team_id: '', medal: 'gold', note: '' },
}
