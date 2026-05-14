interface SkillGridProps {
  skills: string[]
  emoji: string
}

export const SkillGrid = ({ skills, emoji }: SkillGridProps) => (
  <div className="glass rounded-3xl p-8 mt-8 backdrop-blur-md">
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {skills.map((skill, idx) => (
        <div key={idx} className="flex items-center gap-3 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
          <span className="text-2xl">{emoji}</span>
          <span className="font-medium text-white">{skill}</span>
        </div>
      ))}
    </div>
  </div>
)
