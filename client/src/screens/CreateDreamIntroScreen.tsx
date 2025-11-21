import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const CreateDreamIntroScreen = () => {
  const navigate = useNavigate();

  const handleStartJourney = () => {
    navigate('/create-goal/basic');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative flex min-h-screen w-full flex-col bg-background-dark overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-center bg-no-repeat bg-cover"
          style={{
            backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAUAqCl-tRL4VViYF5057NvbxC6b0cneOO1SBM-eib9Ht06MqdClV-STfolkOk4Sr0ddeTrG8RIT3sc4hwgSTdI7yzBhOhijLSeC_7zxjeEUtQl5N1ssNtAdNLhpWwWD494e52647AEzSLqurG8wHG1upmmrsCAEIEAR-EXw6UTrDs0aqw0krjbyZTT9hylLHGPU0iDYbxh7mu7RC6IXWYMB5cQ2Tado_5Hkpcw81JzamgyMNFMvtN_-MBcIgZ0uIw8uzvZNqiNQSAJ")'
          }}
        >
          <div className="w-full h-full bg-black/60"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center p-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col items-center max-w-md"
        >
          <h1 
            className="text-white tracking-tight text-[28px] sm:text-3xl font-extrabold leading-tight pb-2"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            СОЗДАЙ СВОЮ МЕЧТУ
          </h1>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-white/90 text-base font-normal leading-normal pb-4 max-w-sm"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            ПОСТРОЙ ДОРОГУ К СВОИМ ЦЕЛЯМ
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-white/80 text-sm font-light leading-relaxed pb-8 max-w-xs"
            style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.01em' }}
          >
            Каждая великая история начинается с первого шага. Определи свою мечту, и мы поможем тебе проложить путь к ней.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full px-4"
          >
            <button
              onClick={handleStartJourney}
              className="flex min-w-[84px] w-full max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-5 bg-[#FF8C00] hover:bg-[#FF7A00] text-white text-base font-semibold leading-normal tracking-[0.015em] shadow-lg transition-all duration-300 hover:shadow-xl active:scale-95"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <span className="truncate">НАЧАТЬ ПУТЕШЕСТВИЕ</span>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CreateDreamIntroScreen;

