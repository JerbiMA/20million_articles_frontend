import React from 'react';

/**
 * Bespoke Sports Vector Icons for MRIWL Circular Collections
 * Styled to match Screenshot 2: bold black line art on energetic lime-green background (#9bd424)
 * Transparent fills, athletic proportions, high-definition SVG geometry.
 */

// 1. Maillot Classique Rétro (Polo vintage avec rayures verticales & blason)
export const ClassicShirtIcon = ({ size = 70, color = '#0f172a' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Shirt Silhouette */}
    <path
      d="M30 30L12 44L22 58L30 52V85H70V52L78 58L88 44L70 30L58 20H42L30 30Z"
      stroke={color}
      strokeWidth="3.6"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    {/* Polo V-Collar with Lapels */}
    <path d="M42 20L50 36L58 20" stroke={color} strokeWidth="3.2" strokeLinejoin="round" />
    <path d="M36 25L42 20L50 36L44 40L36 25Z" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M64 25L58 20L50 36L56 40L64 25Z" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
    <line x1="50" y1="36" x2="50" y2="48" stroke={color} strokeWidth="3" strokeLinecap="round" />
    {/* Retro Vertical Stripes */}
    <line x1="38" y1="52" x2="38" y2="85" stroke={color} strokeWidth="3.2" />
    <line x1="46" y1="48" x2="46" y2="85" stroke={color} strokeWidth="3.2" />
    <line x1="54" y1="48" x2="54" y2="85" stroke={color} strokeWidth="3.2" />
    <line x1="62" y1="52" x2="62" y2="85" stroke={color} strokeWidth="3.2" />
    {/* Chest Club Shield Badge */}
    <path d="M34 38H40V46C40 48 37 50 37 50C37 50 34 48 34 46V38Z" fill={color} stroke={color} strokeWidth="1" />
  </svg>
);

// 2. Maillot Nouvelle Saison (Col V moderne, découpes aérodynamiques & logo)
export const NewSeasonShirtIcon = ({ size = 70, color = '#0f172a' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Modern Athletic Shirt Contour */}
    <path
      d="M32 28L12 42L22 56L30 50V85H70V50L78 56L88 42L68 28L56 18H44L32 28Z"
      stroke={color}
      strokeWidth="3.6"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    {/* Sharp Modern V-Neck */}
    <path d="M44 18L50 32L56 18" stroke={color} strokeWidth="3.6" strokeLinejoin="round" strokeLinecap="round" />
    {/* Sleeve Cuffs Contour */}
    <line x1="16" y1="48" x2="25" y2="54" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
    <line x1="84" y1="48" x2="75" y2="54" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
    {/* Athletic Ergonomic Seam Curves */}
    <path d="M30 54C35 64 35 74 30 85" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
    <path d="M70 54C65 64 65 74 70 85" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
    {/* Technical Shoulder Lines */}
    <line x1="38" y1="24" x2="28" y2="38" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="62" y1="24" x2="72" y2="38" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// 3. Kits Enfants & Juniors (Jeune footballeur avec ballon au pied - Screenshot 2)
export const KidsKitIcon = ({ size = 70, color = '#0f172a' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Head & Hair */}
    <circle cx="50" cy="22" r="10" stroke={color} strokeWidth="3.4" />
    <path d="M41 21C42 15 46 13 50 13C55 13 59 15 59 21" stroke={color} strokeWidth="3.2" strokeLinecap="round" />
    {/* Cute Kid Jersey */}
    <path
      d="M36 34L25 42L31 49L36 46V62H64V46L69 49L75 42L64 34H36Z"
      stroke={color}
      strokeWidth="3.4"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    {/* Number on shirt */}
    <circle cx="50" cy="46" r="3.5" fill={color} />
    {/* Shorts */}
    <path
      d="M37 62H63V74H52V67H48V74H37V62Z"
      stroke={color}
      strokeWidth="3.4"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    {/* Legs */}
    <line x1="42" y1="74" x2="42" y2="84" stroke={color} strokeWidth="3.4" strokeLinecap="round" />
    <line x1="58" y1="74" x2="58" y2="84" stroke={color} strokeWidth="3.4" strokeLinecap="round" />
    {/* Classic Football at feet */}
    <circle cx="68" cy="80" r="9" stroke={color} strokeWidth="3" />
    {/* Football pentagon & seams */}
    <polygon points="68,76 71,78 70,82 66,82 65,78" fill={color} />
    <line x1="68" y1="76" x2="68" y2="71" stroke={color} strokeWidth="1.8" />
    <line x1="71" y1="78" x2="76" y2="76" stroke={color} strokeWidth="1.8" />
    <line x1="70" y1="82" x2="74" y2="86" stroke={color} strokeWidth="1.8" />
    <line x1="66" y1="82" x2="62" y2="86" stroke={color} strokeWidth="1.8" />
    <line x1="65" y1="78" x2="60" y2="76" stroke={color} strokeWidth="1.8" />
  </svg>
);

// 4. Pack Mystère (Boîte coffret stylisée en hauteur avec ruban - Screenshot 2)
export const MysteryPackIcon = ({ size = 70, color = '#0f172a' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Tall Premium Gift Box */}
    <rect x="36" y="15" width="28" height="70" rx="3" stroke={color} strokeWidth="3.6" />
    {/* Box Fold Lines & Geometric Wrap */}
    <line x1="36" y1="36" x2="64" y2="24" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
    <line x1="36" y1="52" x2="64" y2="40" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
    <line x1="36" y1="64" x2="64" y2="76" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
    {/* Mystery Window Emblem */}
    <rect x="42" y="44" width="16" height="18" rx="2" stroke={color} strokeWidth="2.5" />
    <text x="50" y="58" fontSize="14" fontWeight="900" textAnchor="middle" fill={color} fontFamily="sans-serif">?</text>
    {/* Box Top Ribbon Bow */}
    <path d="M44 15C44 9 47 7 50 12C53 7 56 9 56 15" stroke={color} strokeWidth="2.8" strokeLinejoin="round" />
  </svg>
);

// 5. Survêtements & Vestes (Veste zippée style bomber/training - Screenshot 2)
export const TrackJacketIcon = ({ size = 70, color = '#0f172a' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Bomber Track Jacket Silhouette */}
    <path
      d="M32 26L12 40L20 54L30 46V82H70V46L80 54L88 40L68 26H32Z"
      stroke={color}
      strokeWidth="3.6"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    {/* Ribbed Baseball Collar */}
    <path d="M38 26C38 18 62 18 62 26" stroke={color} strokeWidth="3.2" strokeLinecap="round" />
    {/* Front Zipper */}
    <line x1="50" y1="26" x2="50" y2="82" stroke={color} strokeWidth="3.4" strokeLinecap="round" />
    {/* Zipper Pull Tab */}
    <rect x="48" y="34" width="4" height="6" rx="1" fill={color} />
    {/* Slanted Side Pockets */}
    <line x1="36" y1="66" x2="44" y2="61" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <line x1="64" y1="66" x2="56" y2="61" stroke={color} strokeWidth="3" strokeLinecap="round" />
    {/* Ribbed Waist & Cuffs */}
    <line x1="30" y1="77" x2="70" y2="77" stroke={color} strokeWidth="2.8" />
    <line x1="16" y1="46" x2="22" y2="52" stroke={color} strokeWidth="2.8" />
    <line x1="84" y1="46" x2="78" y2="52" stroke={color} strokeWidth="2.8" />
  </svg>
);

// 6. Kits Training (Maillot + Short d'entraînement - Screenshot 2)
export const TrainingSetIcon = ({ size = 70, color = '#0f172a' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Training Top */}
    <path
      d="M32 18L16 28L22 38L28 34V54H72V34L78 38L84 28L68 18H32Z"
      stroke={color}
      strokeWidth="3.4"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    <path d="M43 18C43 22 57 22 57 18" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
    {/* Club Crest dot */}
    <circle cx="37" cy="28" r="3" fill={color} />
    {/* Athletic horizontal chest bar */}
    <line x1="45" y1="36" x2="65" y2="36" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
    <line x1="45" y1="41" x2="58" y2="41" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    {/* Training Shorts */}
    <path
      d="M34 58H66V78H53V68H47V78H34V58Z"
      stroke={color}
      strokeWidth="3.4"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    <line x1="39" y1="72" x2="43" y2="72" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
  </svg>
);

// 7. Trophées & Médailles (Coupe dorée + Médaille - Screenshot 2)
export const MedalsCupsIcon = ({ size = 70, color = '#0f172a' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Trophy Cup */}
    <path
      d="M48 22H78V42C78 51 70 57 63 57C56 57 48 51 48 42V22Z"
      stroke={color}
      strokeWidth="3.4"
      strokeLinejoin="round"
    />
    {/* Left Trophy Ear Handle */}
    <path d="M48 26H40C36 26 36 38 48 38" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
    {/* Right Trophy Ear Handle */}
    <path d="M78 26H86C90 26 90 38 78 38" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
    {/* Stem & Solid Pedestal Base */}
    <line x1="63" y1="57" x2="63" y2="70" stroke={color} strokeWidth="4" strokeLinecap="round" />
    <rect x="51" y="70" width="24" height="9" rx="2" fill={color} stroke={color} strokeWidth="1" />
    {/* Crown on top of cup */}
    <path d="M52 18L56 22L63 17L70 22L74 18" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    {/* Championship Ribbon Medal */}
    <path d="M20 28L28 48L36 28" stroke={color} strokeWidth="3" strokeLinejoin="round" />
    <circle cx="28" cy="58" r="12" stroke={color} strokeWidth="3.4" />
    {/* Star inside Medal */}
    <polygon points="28,51 30,56 35,56 31,59 33,64 28,61 23,64 25,59 21,56 26,56" fill={color} />
  </svg>
);

// 8. Dédicaces & Cadre Collector (Maillot Maradona 10 encadré avec signatures - Screenshot 2)
export const SignedFrameIcon = ({ size = 70, color = '#0f172a' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Museum Quality Outer Frame */}
    <rect x="22" y="14" width="56" height="72" rx="3" stroke={color} strokeWidth="3.8" />
    {/* Inner Mat Border */}
    <rect x="27" y="19" width="46" height="62" rx="1" stroke={color} strokeWidth="1.8" strokeDasharray="3 2" />
    {/* Folded Shirt inside frame */}
    <path
      d="M36 25L30 31L34 37L38 35V56H62V35L66 37L70 31L64 25H36Z"
      stroke={color}
      strokeWidth="2.8"
      strokeLinejoin="round"
    />
    {/* Legendary Number 10 */}
    <text x="50" y="48" fontSize="15" fontWeight="900" textAnchor="middle" fill={color} fontFamily="sans-serif">10</text>
    {/* Player Signature scribble */}
    <path d="M38 52C42 50 46 54 52 51C55 50 58 53 62 51" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Official Certificate of Authenticity Plaque */}
    <rect x="36" y="64" width="28" height="12" rx="1.5" stroke={color} strokeWidth="2.4" />
    <line x1="40" y1="68" x2="60" y2="68" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <line x1="43" y1="72" x2="57" y2="72" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// 9. Guide des Tailles (Maillot avec flèches de mesure <---> & SIZE CHART - Screenshot 2)
export const SizeChartIcon = ({ size = 70, color = '#0f172a' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* T-Shirt Silhouette */}
    <path
      d="M32 26L18 38L25 48L32 44V76H68V44L75 48L82 38L68 26H32Z"
      stroke={color}
      strokeWidth="3.4"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    <path d="M42 26C42 30 58 30 58 26" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
    {/* Size Chart Typography */}
    <text x="50" y="46" fontSize="8.5" fontWeight="900" textAnchor="middle" fill={color} fontFamily="sans-serif">SIZE</text>
    <text x="50" y="57" fontSize="8.5" fontWeight="900" textAnchor="middle" fill={color} fontFamily="sans-serif">CHART</text>
    {/* Horizontal Width Arrow |<--->| */}
    <line x1="24" y1="84" x2="76" y2="84" stroke={color} strokeWidth="2.6" />
    <line x1="24" y1="80" x2="24" y2="88" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
    <line x1="76" y1="80" x2="76" y2="88" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
    <polygon points="27,84 31,81 31,87" fill={color} />
    <polygon points="73,84 69,81 69,87" fill={color} />
    {/* Vertical Height Arrow */}
    <line x1="84" y1="44" x2="84" y2="76" stroke={color} strokeWidth="2.6" />
    <line x1="80" y1="44" x2="88" y2="44" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
    <line x1="80" y1="76" x2="88" y2="76" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
    <polygon points="84,47 81,51 87,51" fill={color} />
    <polygon points="84,73 81,69 87,69" fill={color} />
  </svg>
);

// 10. Bons Plans & Offre Spéciale (-10% / Remise - Screenshot 2)
export const PromoOfferIcon = ({ size = 70, color = '#0f172a' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Dark Jersey Base Silhouette */}
    <path
      d="M30 24L14 36L22 48L30 42V78H70V42L78 48L86 36L70 24H30Z"
      fill={color}
      stroke={color}
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    {/* Large Vivid Discount Round Badge */}
    <circle cx="50" cy="52" r="21" fill="#facc15" stroke="#ffffff" strokeWidth="3" />
    <text x="50" y="49" fontSize="11" fontWeight="900" textAnchor="middle" fill="#0f172a" fontFamily="sans-serif">-10%</text>
    <text x="50" y="60" fontSize="7" fontWeight="900" textAnchor="middle" fill="#0f172a" fontFamily="sans-serif">OFFRE</text>
  </svg>
);
