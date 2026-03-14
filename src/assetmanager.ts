import { IAssetList, AssetTypes } from "./typeinterfaces.ts";

/**
 * Manages the assets for a game.
 * You can download and add images, audio files,
 * or other raw data. Image and audio assets can
 * be obtained directly as HTML objets.
 * 
 * @author Preston Sia, Chris Marriott
 */
export default class AssetManager {
  private successCount: number;
  private errorCount: number;
  /** Cache of blob items if no type or "other" type was specified for a resource */
  private rawCache: Map<string, Blob>;
  private imageCache: Map<string, HTMLImageElement>;
  private audioCache: Map<string, AudioBuffer>;
  private downloadQueue: IAssetList[];
  private globalVolume: number;
  private audioContext: AudioContext;
  private masterGainNode: GainNode;
  private activeMusicSources: AudioBufferSourceNode[];

  constructor() {
    this.successCount = 0;
    this.errorCount = 0;
    this.rawCache = new Map();
    this.imageCache = new Map();
    this.audioCache = new Map();
    this.downloadQueue = [];
    this.globalVolume = 1.0;
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGainNode = this.audioContext.createGain();
    this.masterGainNode.gain.value = this.globalVolume;
    this.masterGainNode.connect(this.audioContext.destination);
    this.activeMusicSources = [];
  };

  /**
   * Queues an asset to be downloaded
   * 
   * @param assetId An alphanumeric ID to name the asset
   * @param assetType The type of file being downloaded
   * @param path File path to the asset
   */
  public queueDownload(assetId: string, assetType: AssetTypes, path: string): void {
    console.log(`Queing item \"${assetId}\" of type \"${assetType}\" at path \"${path}\"`);
    this.downloadQueue.push({ id: assetId, type: assetType, location: path });
  };

  /**
   * Downloads all assets in the download queue
   * @returns Promise<void> for when all assets are loaded
   */
  public downloadAll(): Promise<void> {
    return new Promise(async (resolve) => {
      while (this.downloadQueue.length > 0) {
        const item: IAssetList | undefined = this.downloadQueue.pop();

        // Perform null/undefined check
        if (item === undefined || item === null) {
          continue;
        }

        try {
          const response = await fetch(item.location);
          if (!response.ok) {
            this.errorCount++;
            console.error(`Error ${response.status} on resource ${item.id} at location ${item.location}`);
          } else {
            // create a blob object of the resource
            const blob = await response.blob();

            switch (item.type) {
              case 'img':
                this.buildImgObj(blob, item.id);
                break;
              case 'audio':
                this.buildAudioObj(blob, item.id);
                break;
              default:
                this.rawCache.set(item.id, blob);
                this.successCount++;
            }
          }
        } catch (error) {
          this.errorCount++;
          console.error(error);
        }
      }

      resolve();
    });
  }

  private buildImgObj(data: Blob, itemId: string) {
    if (data.type.split('/')[0] !== 'image') {
      this.errorCount++;
      console.error(`Error on ${itemId}: Type mismatch. Expected an image object but got MIME type ${data.type}`)
    } else {
      const image: HTMLImageElement = new Image();
      const imageObjectUrl = URL.createObjectURL(data);
      image.src = imageObjectUrl;
      image.onload = () => { // cleanup data after it's loaded
        URL.revokeObjectURL(imageObjectUrl);
      }
      this.imageCache.set(itemId, image);
      this.successCount++;
    }
  }

  private async buildAudioObj(data: Blob, itemId: string) {
    try {
      const arrayBuffer = await data.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.audioCache.set(itemId, audioBuffer);
      this.successCount++;
    } catch (e) {
      this.errorCount++;
      console.error(`Failed to decode audio data for ${itemId}`, e);
    }
  }

  public getAudioContext(): AudioContext {
    return this.audioContext;
  }

  public playMusic(id: string, loopStart?: number, loopEnd?: number, offset: number = 0): { source: AudioBufferSourceNode, gainNode: GainNode } | null {
    const buffer = this.audioCache.get(id);
    if (!buffer) return null;
    
    // Resume context if suspended
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    
    if (loopStart !== undefined && loopEnd !== undefined) {
      source.loop = true;
      source.loopStart = loopStart;
      source.loopEnd = loopEnd;
    } else {
      source.loop = false;
    }

    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = 1.0; // Individual gain, master gain controls overall volume

    source.connect(gainNode);
    gainNode.connect(this.masterGainNode);
    
    source.start(0, offset);
    
    // Track active music source
    this.activeMusicSources.push(source);
    
    // Remove from tracking when it ends

    source.onended = () => {
      const index = this.activeMusicSources.indexOf(source);
      if (index > -1) {
        this.activeMusicSources.splice(index, 1);
      }
    };
    
    return { source, gainNode };
  }

  /**
   * Stops all currently playing music
   * 
   * This is for when the player presses back to menu to prevent
   * multiple audio loops from playing as opening menu starts an audio loop
   */
  public stopAllMusic(): void {
    this.activeMusicSources.forEach(source => {
      try {
        source.stop();
      } catch (e) {
        // Source may have already stopped
      }
    });
    this.activeMusicSources = [];
  }

  /**
   * Returns the asset blob of a generic asset without a type specified
   * @param assetId ID of the asset
   * @returns A blob object or null if it doesn't exist
   */
  public getRawAsset(assetId: string): Blob | null {
    const cacheData = this.rawCache.get(assetId);
    if (cacheData === undefined) {
      return null;
    } else {
      return cacheData;
    }
  }

  /**
   * Returns the image asset of the specified asset ID
   * @param assetId ID of the image asset
   * @returns An HTMLImageElement of the image
   */
  public getImageAsset(assetId: string): HTMLImageElement | null {
    const image = this.imageCache.get(assetId);
    if (image === undefined) {
      return null;
    } else {
      return image;
    }
  }

  /**
   * Returns the audio asset of the specified asset ID
   * @param assetId ID of the audio asset
   * @returns An AudioBuffer of the audio object
   */
  public getAudioAsset(assetId: string): AudioBuffer | null {
    const audio = this.audioCache.get(assetId);
    if (audio === undefined) {
      return null;
    } else {
      return audio;
    }
  }

  public setVolume(volume: number): void {
    this.globalVolume = Math.max(0, Math.min(1, volume));
    this.masterGainNode.gain.value = this.globalVolume;
  }

  public getVolume(): number {
    return this.globalVolume;
  }
};