import { motion } from 'framer-motion';
import { ExternalLink, Github as GithubIcon, BookOpen, Award, Wrench, Cpu } from 'lucide-react';
import type { ProjectDetails } from '../../types';

interface ProjectInfoProps {
  title: string;
  description: string;
  category?: string;
  tags: string[];
  emoji: string;
  colors: string[];
  details?: ProjectDetails;
}

export const ProjectInfo = ({ title, description, category, tags, emoji, colors, details = {} }: ProjectInfoProps) => {
  return (
    <div className="pb-8">
      {/* 项目标题卡片 */}
      <motion.section
        className="py-6 px-4 md:px-8"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="glass rounded-3xl p-6 md:p-8"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-start gap-5">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}
              >
                {emoji}
              </div>
              <div>
                {category && (
                  <span
                    className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 text-white/80"
                    style={{ background: 'rgba(0, 212, 255, 0.2)', border: '1px solid rgba(0, 212, 255, 0.3)' }}
                  >
                    {category}
                  </span>
                )}
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  {title}
                </h2>
                <p className="text-white/70 leading-relaxed">
                  {description}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-5">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-sm text-white/80"
                  style={{ background: 'rgba(0, 212, 255, 0.15)', border: '1px solid rgba(0, 212, 255, 0.25)' }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {(details.demoUrl || details.githubUrl || details.documentUrl) && (
              <div className="flex flex-wrap gap-3 mt-5 pt-5 border-t border-white/10">
                {details.demoUrl && (
                  <a
                    href={details.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2 rounded-full font-medium text-white hover:opacity-80 transition-opacity text-sm"
                    style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}
                  >
                    <ExternalLink size={15} />
                    在线演示
                  </a>
                )}
                {details.githubUrl && (
                  <a
                    href={details.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2 rounded-full font-medium bg-white/10 text-white hover:bg-white/20 transition text-sm border border-white/20"
                  >
                    <GithubIcon size={15} />
                    GitHub
                  </a>
                )}
                {details.documentUrl && (
                  <a
                    href={details.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2 rounded-full font-medium text-cyan-400 hover:text-cyan-300 transition text-sm border border-cyan-400/40 hover:border-cyan-300/60"
                  >
                    <BookOpen size={15} />
                    详细文档
                  </a>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* 项目概览 */}
      {details.overview && (
        <motion.section
          className="py-6 px-4 md:px-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-2xl">📋</span>
              项目概览
            </h3>
            <div className="glass rounded-2xl p-5 md:p-6">
              <p className="text-white/70 leading-relaxed whitespace-pre-wrap">{details.overview}</p>
            </div>
          </div>
        </motion.section>
      )}

      {/* 故事背景 */}
      {details.story && (
        <motion.section
          className="py-6 px-4 md:px-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-2xl">📖</span>
              故事背景
            </h3>
            <div className="glass rounded-2xl p-5 md:p-6">
              <p className="text-white/70 leading-relaxed">{details.story}</p>
            </div>
          </div>
        </motion.section>
      )}

      {/* 核心特性 */}
      {details.features && details.features.length > 0 && (
        <motion.section
          className="py-6 px-4 md:px-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-2xl">✨</span>
              核心特性
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {details.features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  className="glass rounded-xl p-4 flex items-start gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.07 }}
                  whileHover={{ y: -3 }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold text-white"
                    style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}
                  >
                    {idx + 1}
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">{feature}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* 技术实现 */}
      {details.techDetails && details.techDetails.length > 0 && (
        <motion.section
          className="py-6 px-4 md:px-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <Cpu size={22} className="text-cyan-400" />
              技术实现
            </h3>
            <div className="glass rounded-2xl p-5 md:p-6">
              <div className="space-y-3">
                {details.techDetails.map((tech, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-cyan-400" />
                    <span className="text-white/70 text-sm">{tech}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* 项目信息 */}
      {(details.role || details.engine || (details.tools && details.tools.length > 0)) && (
        <motion.section
          className="py-6 px-4 md:px-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <Wrench size={22} className="text-cyan-400" />
              项目信息
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {(details.role || details.engine) && (
                <div className="glass rounded-2xl p-5">
                  <div className="space-y-3">
                    {details.role && (
                      <div>
                        <span className="text-xs text-white/50">角色</span>
                        <p className="font-bold text-white">{details.role}</p>
                      </div>
                    )}
                    {details.engine && (
                      <div>
                        <span className="text-xs text-white/50">引擎</span>
                        <p className="font-bold text-white">{details.engine}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {details.tools && details.tools.length > 0 && (
                <div className="glass rounded-2xl p-5">
                  <span className="text-xs text-white/50">使用工具</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {details.tools.map((tool, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-full text-sm bg-white/10 text-white/80">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.section>
      )}

      {/* 成就 */}
      {details.achievements && details.achievements.length > 0 && (
        <motion.section
          className="py-6 px-4 md:px-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <Award size={22} className="text-cyan-400" />
              项目成就
            </h3>
            <div className="glass rounded-2xl p-5 md:p-6">
              <div className="grid md:grid-cols-2 gap-3">
                {details.achievements.map((achievement, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-3 bg-white/10 rounded-xl">
                    <span className="text-base mt-0.5">✅</span>
                    <span className="text-white/80 text-sm">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      )}
    </div>
  );
};
