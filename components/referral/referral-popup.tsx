import { motion } from "framer-motion";
import { CheckCircle, X, Gift } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

interface ReferralPopupProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  planId: string;
  duration: number;
  features: string[];
}

export default function ReferralPopup({ isOpen, onClose, planName, planId, duration, features }: ReferralPopupProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-primary rounded-2xl p-8 max-w-md w-full shadow-2xl relative"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-primary transition-colors"
        >
          <X size={24} />
        </button>

        {/* Celebration animation */}
        <div className="text-center mb-6">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: 3, duration: 0.5 }}
            className="inline-block"
          >
            <Gift className="w-16 h-16 text-accent mx-auto mb-4" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-accent mb-2">
            {t('referral.popup.title')}
          </h2>
          
          <p className="text-muted">
            {t('referral.popup.subtitle')}
          </p>
        </div>

        {/* Reward details */}
        <div className="bg-surface rounded-lg p-6 mb-6">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-success mr-3" />
            <div>
              <h3 className={`text-lg font-semibold ${planId === 'ultimate' ? 'text-gradient-accent' : 'text-accent'}`}>
                {planName} {t('referral.popup.plan_activated')}
              </h3>
              <p className="text-sm text-muted">
                {duration} {duration === 1 ? t('referral.popup.day') : t('referral.popup.days')} {t('referral.popup.free')}
              </p>
            </div>
          </div>

          {/* Features list */}
          <div className="space-y-3">
            <h4 className="font-medium text-primary">
              {t('referral.popup.features_included')}:
            </h4>
            {features.slice(0, 5).map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center"
              >
                <CheckCircle className="w-4 h-4 text-success mr-2 flex-shrink-0" />
                <span className="text-sm text-primary">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="w-full bg-accent text-negated-primary font-semibold py-3 rounded-xl hover:bg-accent-heavy transition-colors"
          >
            {t('referral.popup.start_exploring')}
          </motion.button>
          
          <p className="text-xs text-center text-muted">
            {t('referral.popup.thanks_message')}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
