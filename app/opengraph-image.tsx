export {
  SOCIAL_IMAGE_SIZE as size,
  SOCIAL_IMAGE_CONTENT_TYPE as contentType,
  SOCIAL_IMAGE_ALT as alt,
} from '@/src/shared/brand';
import { renderBrandSocialImage } from '@/src/shared/brand';

export default function OpengraphImage() {
  return renderBrandSocialImage();
}
