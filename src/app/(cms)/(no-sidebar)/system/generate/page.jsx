"use client"
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Check } from 'lucide-react';

const fields = {
  outfit: ['a white lace dress with a deep V-neckline and delicate spaghetti straps', 'a red silk hanbok with golden embroidery', 'a black modern cocktail dress'],
  bodyShape: ['slender frame', 'curvy silhouette', 'petite build'],
  bust: ['full, graceful bust', 'elegant neckline', 'defined collarbones'],
  pattern: ['intricate patterns', 'floral embroidery', 'minimalist design'],
  fabric: ['soft and slightly textured', 'silky and flowing', 'transparent mesh'],
  lighting: ['moonlit glow', 'golden hour light', 'neon blue lighting'],
  makeupStyle: ['subtle yet striking', 'bold and artistic', 'natural and glowing'],
  skinTone: ['radiant complexion', 'dewy finish', 'porcelain skin'],
  blush: ['deep rose blush', 'peachy tint', 'sunset coral'],
  lips: ['gradient lip with a darker tint towards the center', 'bold red lips', 'nude matte lips'],
  eyeshadow: ['smoky shadow', 'glitter shimmer', 'cat-eye liner'],
  bg: ['deep green foliage', 'misty bamboo forest', 'urban city skyline'],
  bgLight: ['moonlight', 'neon glow', 'sunlight filtering through trees'],
  mood: ['dreamlike, hauntingly beautiful', 'romantic and nostalgic', 'mystical and enchanting'],
  colorPalette: ['soft whites, deep greens, and dusky silver hues', 'warm golds and blush pinks', 'cool blues and purples'],
  contrast: ['pale skin', 'glowing complexion', 'warm undertone'],
  aesthetic: ['otherworldly, almost supernatural', 'high-fashion fantasy', 'cyberpunk elegance'],
  metaphor: ['an ethereal goddess', 'a modern muse', 'a celestial queen'],
  highlights: ['delicate collarbones to her full bust, slightly parted lips', 'sharp cheekbones to her intense gaze', 'graceful hands to her flowing hair'],
  elegance: ['timeless, supernatural elegance', 'captivating visual poetry', 'sophisticated surreal charm'],
  aspectRatio: ['9:16 aspect ratio', '16:9 cinematic ratio', '1:1 square frame'],
  composition: ['vertical portrait composition', 'full-body centered frame', 'close-up face composition'],
  expression: ['intense and hypnotic expression', 'soft and vulnerable look', 'mysterious, unreadable gaze'],
  vibe: ['enigmatic and haunting beauty', 'fashion-forward elegance', 'angelic presence']
};

const fieldLabels = {
  outfit: 'Outfit - Trang phục (Trên người)',
  bodyShape: 'Body Shape - Dáng người',
  bust: 'Bust - Vòng 1 / Ngực',
  pattern: 'Pattern - Họa tiết',
  fabric: 'Fabric - Chất liệu vải',
  lighting: 'Lighting - Ánh sáng',
  makeupStyle: 'Makeup Style - Phong cách trang điểm',
  skinTone: 'Skin Tone - Tông da',
  blush: 'Blush - Má hồng',
  lips: 'Lips - Môi',
  eyeshadow: 'Eyeshadow - Phấn mắt',
  bg: 'Background - Hậu cảnh',
  bgLight: 'Background Light - Ánh sáng hậu cảnh',
  mood: 'Mood - Bầu không khí',
  colorPalette: 'Color Palette - Bảng màu',
  contrast: 'Contrast - Tương phản',
  aesthetic: 'Aesthetic - Thẩm mỹ tổng thể',
  metaphor: 'Metaphor - Hình tượng ví von',
  highlights: 'Highlights - Chi tiết nổi bật',
  elegance: 'Elegance - Vẻ đẹp tổng thể',
  aspectRatio: 'Aspect Ratio - Tỷ lệ khung hình',
  composition: 'Composition - Bố cục ảnh',
  expression: 'Expression - Biểu cảm',
  vibe: 'Vibe - Cảm xúc chung'
};

export default function PromptTemplateApp() {
  const [values, setValues] = useState(
    Object.fromEntries(Object.entries(fields).map(([key, options]) => [key, options[0]]))
  );
  const [customValues, setCustomValues] = useState({});
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const handleChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setCustomValues((prev) => ({ ...prev, [key]: '' }));
  };

  const handleCustomChange = (key, value) => {
    setCustomValues((prev) => ({ ...prev, [key]: value }));
  };

  const generatePrompt = () => {
    const finalValues = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [key, customValues[key]?.trim() || value])
    );

    const prompt = `A stunningly beautiful young Korean woman, likely in her late teens or early twenties, is the central subject. She is positioned directly in the center of the frame, facing the camera head-on with a poised and confident posture. Her expression is calm yet deeply alluring, with large, mesmerizing double eyelids, luminous eyes that glisten with a supernatural sparkle, and long, sensuous curled eyelashes that enhance her hypnotic, seductive gaze. Her full lips, slightly parted, and flawless porcelain-like skin add to her ethereal and almost otherworldly beauty. Her presence exudes an enigmatic charm, as if she holds untold secrets within her captivating stare.

She has long, silky dark hair that cascades naturally over her shoulders, framing her delicate yet striking facial features. A few stray strands fall across her face, subtly enhancing the mysterious aura surrounding her. She is wearing ${finalValues.outfit}, the fabric clinging elegantly to her ${finalValues.bodyShape} and subtly accentuating her ${finalValues.bust}, adding a sense of femininity and softness to her silhouette. The lace has ${finalValues.pattern}, giving the dress a mystical touch. The fabric is ${finalValues.fabric}, subtly shimmering under the ${finalValues.lighting}, as if enchanted.

Her makeup is ${finalValues.makeupStyle}, featuring a ${finalValues.skinTone} complexion, a whisper of ${finalValues.blush} on her cheeks, and a ${finalValues.lips}, enhancing the illusion of a bewitching allure. Her eyes, lined with a hint of ${finalValues.eyeshadow}, seem to pierce through the veil of reality, drawing the viewer into her enigmatic presence. The lighting is ${finalValues.lighting}, with a mysterious glow casting delicate highlights on her face, accentuating her sharp yet graceful features.

The blurred background consists of ${finalValues.bg}, faintly illuminated as if bathed in ${finalValues.bgLight}, creating a ${finalValues.mood} atmosphere. The color palette consists of ${finalValues.colorPalette}, reinforcing the ${finalValues.mood} mood. The contrast between her ${finalValues.contrast} and the darker background intensifies the ${finalValues.aesthetic} aesthetic. The overall aesthetic is ${finalValues.aesthetic}, reminiscent of ${finalValues.metaphor}. Every detail, from her ${finalValues.highlights}, embodies a ${finalValues.elegance}.

The image should be in a ${finalValues.aspectRatio}, ensuring a ${finalValues.composition} that highlights her ${finalValues.vibe}. Her face should be perfectly centered in the frame, looking directly at the camera with an ${finalValues.expression}, evoking an ${finalValues.vibe}.`;

    setResult(prompt);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (result) {
      await navigator.clipboard.writeText(result);
      setCopied(true);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Prompt Generator</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(fields).map(([key, options]) => (
          <div key={key} className="space-y-1">
            <label className="block text-sm font-semibold">{fieldLabels[key]}</label>
            <Select onValueChange={(value) => handleChange(key, value)} defaultValue={values[key]}>
              <SelectTrigger>
                <SelectValue>{values[key]}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {options.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Hoặc nhập tùy chỉnh..."
              value={customValues[key] || ''}
              onChange={(e) => handleCustomChange(key, e.target.value)}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-4 items-center">
        <Button onClick={generatePrompt}>Generate Prompt</Button>
        <Button onClick={handleCopy} variant="outline">
          {copied ? <Check className="w-4 h-4 mr-2 text-green-500" /> : null}
          Copy Prompt
        </Button>
      </div>
      <Textarea className="mt-4 h-96" value={result} readOnly />
    </div>
  );
}