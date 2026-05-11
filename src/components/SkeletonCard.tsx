interface SkeletonCardProps {
  isLarge?: boolean
}

export const SkeletonCard = ({ isLarge }: SkeletonCardProps) => (
  <div className={`skeleton skeleton-card bento-item ${isLarge ? 'large' : ''}`}>
    <div className={`skeleton ${isLarge ? 'bento-image-large' : 'bento-image-normal'} mb-4`}></div>
    <div className="skeleton skeleton-title mb-2"></div>
    <div className="skeleton skeleton-text mb-2"></div>
    <div className="skeleton skeleton-text mb-4" style={{ width: '70%' }}></div>
    <div className="flex gap-2">
      <div className="skeleton" style={{ width: '60px', height: '24px' }}></div>
      <div className="skeleton" style={{ width: '50px', height: '24px' }}></div>
      <div className="skeleton" style={{ width: '70px', height: '24px' }}></div>
    </div>
  </div>
)
