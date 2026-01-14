/**
 * Value Object para Media Type
 */
export type MediaTypeValue =
  | 'IMAGE'
  | 'VIDEO'
  | 'CAROUSEL'
  | 'STORY'
  | 'REEL';

const VALID_MEDIA_TYPES: MediaTypeValue[] = [
  'IMAGE',
  'VIDEO',
  'CAROUSEL',
  'STORY',
  'REEL',
];

export class MediaType {
  private readonly value: MediaTypeValue;

  constructor(value: MediaTypeValue) {
    if (!VALID_MEDIA_TYPES.includes(value)) {
      throw new Error(`Invalid media type: ${value}`);
    }
    this.value = value;
  }

  toString(): MediaTypeValue {
    return this.value;
  }

  isImage(): boolean {
    return this.value === 'IMAGE';
  }

  isVideo(): boolean {
    return this.value === 'VIDEO' || this.value === 'REEL';
  }

  isCarousel(): boolean {
    return this.value === 'CAROUSEL';
  }

  isStory(): boolean {
    return this.value === 'STORY';
  }

  isReel(): boolean {
    return this.value === 'REEL';
  }

  /**
   * Verifica se o tipo de mídia suporta agendamento nativo do Meta
   */
  supportsNativeScheduling(): boolean {
    // Stories e Reels não suportam agendamento nativo
    return this.value === 'IMAGE' || this.value === 'CAROUSEL' || this.value === 'VIDEO';
  }

  equals(other: MediaType): boolean {
    return this.value === other.value;
  }
}
