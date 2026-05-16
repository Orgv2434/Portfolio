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
    <div className="min-h-screen">
      {/* 项目概览 */}
      <motion.section
        className="py-16 px-4 md:px-8"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="glass rounded-3xl p-8 md:p-12"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-start gap-6">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
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
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {title}
                </h2>
                <p className="text-white/70 text-lg leading-relaxed">
                  {description}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-6">
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
          </motion.div>
        </div>
      </motion.section>

      {/* 项目概览 */}
      {details.overview && (
        <motion.section
          className="py-16 px-4 md:px-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-4xl mx-auto">
            <motion.h3
              className="text-2xl font-bold text-white mb-6 flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-3xl">📋</span>
              项目概览
            </motion.h3>
            <motion.div
              className="glass rounded-2xl p-6 md:p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className="text-white/70 text-lg leading-relaxed whitespace-pre-wrap">{details.overview}</p>
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* 故事背景 */}
      {details.story && (
        <motion.section
          className="py-16 px-4 md:px-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-4xl mx-auto">
            <motion.h3
              className="text-2xl font-bold text-white mb-6 flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-3xl">📖</span>
              故事背景
            </motion.h3>
            <motion.div
              className="glass rounded-2xl p-6 md:p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className="text-white/70 text-lg leading-relaxed">{details.story}</p>
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* 核心特性 */}
      {details.features && details.features.length > 0 && (
        <motion.section
          className="py-16 px-4 md:px-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-4xl mx-auto">
            <motion.h3
              className="text-2xl font-bold text-white mb-6 flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-3xl">✨</span>
              核心特性
            </motion.h3>
            <div className="grid md:grid-cols-2 gap-4">
              {details.features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  className="glass rounded-xl p-6 flex items-start gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}
                  >
                    <span className="text-white font-bold">{idx + 1}</span>
                  </div>
                  <p className="text-white/80 font-medium">{feature}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* 技术实现 */}
      {details.techDetails && details.techDetails.length > 0 && (
        <motion.section
          className="py-16 px-4 md:px-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-4xl mx-auto">
            <motion.h3
              className="text-2xl font-bold text-white mb-6 flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Cpu size={28} className="text-cyan-400" />
              技术实现
            </motion.h3>
            <div className="glass rounded-2xl p-6 md:p-8">
              <div className="space-y-4">
                {details.techDetails.map((tech, idx) => (
                  <motion.div
                    key={idx}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                  >
                    <div className="w-2 h-2 rounded-full flex-shrink-0 bg-cyan-400" />
                    <span className="text-white/70">{tech}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* 项目信息 */}
      <motion.section
        className="py-16 px-4 md:px-8"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.h3
            className="text-2xl font-bold text-white mb-6 flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Wrench size={28} className="text-cyan-400" />
            项目信息
          </motion.h3>
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              className="glass rounded-2xl p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <div className="space-y-4">
                {details.role && (
                  <div>
                    <span className="text-sm text-white/50">角色</span>
                    <p className="text-lg font-bold text-white">{details.role}</p>
                  </div>
                )}
                {details.engine && (
                  <div>
                    <span className="text-sm text-white/50">引擎</span>
                    <p className="text-lg font-bold text-white">{details.engine}</p>
                  </div>
                )}
              </div>
            </motion.div>

            {details.tools && details.tools.length > 0 && (
              <motion.div
                className="glass rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <span className="text-sm text-white/50">使用工具</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {details.tools.map((tool, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full text-sm bg-white/10 text-white/80"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.section>

      {/* 成就 */}
      {details.achievements && details.achievements.length > 0 && (
        <motion.section
          className="py-16 px-4 md:px-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-4xl mx-auto">
            <motion.h3
              className="text-2xl font-bold text-white mb-6 flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Award size={28} className="text-cyan-400" />
              项目成就
            </motion.h3>
            <div className="glass rounded-2xl p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-4">
                {details.achievements.map((achievement, idx) => (
                  <motion.div
                    key={idx}
                    className="flex items-center gap-3 p-4 bg-white/10 rounded-xl"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                  >
                    <span className="text-xl">✅</span>
                    <span className="text-white/80">{achievement}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* 资源链接 */}
      {(details.demoUrl || details.githubUrl || details.documentUrl) && (
        <motion.section
          className="py-16 px-4 md:px-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-4xl mx-auto">
            <motion.h3
              className="text-2xl font-bold text-white mb-6 flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <BookOpen size={28} className="text-cyan-400" />
              相关资源
            </motion.h3>
            <div className="flex flex-wrap gap-4 justify-center">
              {details.demoUrl && (
                <motion.a
                  href={details.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-full font-medium text-white"
                  style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3 }}
                >
                  <ExternalLink size={18} />
                  在线演示
                </motion.a>
              )}
              {details.githubUrl && (
                <motion.a
                  href={details.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-full font-medium bg-white/10 text-white hover:bg-white/20 transition border border-white/20"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <GithubIcon size={18} />
                  GitHub
                </motion.a>
              )}
              {details.documentUrl && (
                <motion.a
                  href={details.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-full font-medium text-cyan-400 hover:text-cyan-300 transition border border-cyan-400/30 hover:border-cyan-300/50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <BookOpen size={18} />
                  详细文档
                </motion.a>
              )}
            </div>
          </div>
        </motion.section>
      )}
    </div>
  );
};
