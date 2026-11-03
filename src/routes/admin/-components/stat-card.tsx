function StatCard({stats}: {stats: {label: string, value: string, note: string}[]}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map((stat) => (
            <article
              key={stat.label}
              className="rounded-xl border border-[#E8E8DF] bg-white p-5 shadow-sm"
            >
              <p className="text-sm text-[#718075]">{stat.label}</p>
              <h3 className="mt-3 text-2xl font-semibold">{stat.value}</h3>
              <p className="mt-1 text-xs text-[#718075]">{stat.note}</p>
            </article>
          ))}</div>
  )
}

export default StatCard