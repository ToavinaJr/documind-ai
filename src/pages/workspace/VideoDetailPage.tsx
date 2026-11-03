import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { repositories } from '../../repositories';
import { VideoEntity } from '../../types';
import {
  Video,
  ArrowLeft,
  Play,
  Pause,
  Clock,
  Sparkles,
  Download,
  Subtitles,
  Bookmark
} from 'lucide-react';

export const VideoDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentOrganization } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();

  const orgId = currentOrganization?.id || 'org-acme';
  const [video, setVideo] = useState<VideoEntity | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const found = await repositories.video.findById(orgId, id);
      setVideo(found);
    };
    load();
  }, [id, orgId]);

  if (!video) {
    return <div className="py-12 text-center text-xs text-neutral-400">Chargement de la vidéo...</div>;
  }

  const formatSec = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleExportSubtitles = () => {
    const srtContent = `1\n00:00:00,000 --> 00:00:05,000\nBienvenue dans cette session d'accompagnement DocuMind AI.\n\n2\n00:00:05,500 --> 00:00:12,000\nNous allons parcourir ensemble les flux de travail documentaires et les automatisations.`;
    const element = document.createElement('a');
    const file = new Blob([srtContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${video.title}_subtitles.srt`;
    document.body.appendChild(element);
    element.click();
    element.remove();
    success('Sous-titres exportés', 'Fichier .SRT généré avec succès.');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navigate('/workspace/video')}
          className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Retour aux vidéos</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportSubtitles}
            className="px-3 py-1.5 text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Télécharger sous-titres (.SRT)</span>
          </button>
        </div>
      </div>

      {/* Video Viewport & Simulated Player */}
      <div className="bg-black text-white rounded-2xl overflow-hidden border border-neutral-800 p-6 flex flex-col justify-between aspect-video max-h-[420px] relative">
        <div className="flex items-center justify-between">
          <div className="text-xs font-mono text-neutral-400">{video.fileName}</div>
          <div className="text-xs px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono">
            {formatSec(currentTime)} / {formatSec(video.durationSeconds)}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-transform hover:scale-110"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
          </button>
          <div className="mt-4 text-sm font-semibold">{video.title}</div>
        </div>

        {/* Video Scrubber */}
        <div>
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const ratio = (e.clientX - rect.left) / rect.width;
              setCurrentTime(Math.floor(ratio * video.durationSeconds));
            }}
            className="w-full h-2 bg-neutral-800 hover:h-3 rounded-full cursor-pointer relative overflow-hidden transition-all"
          >
            <div
              className="h-full bg-amber-500 rounded-full"
              style={{ width: `${(currentTime / video.durationSeconds) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Chapters & Key Moments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Chapters */}
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
            Chapitrage Sémantique Automatique
          </h2>
          <div className="space-y-3">
            {video.chapters.map((ch, i) => (
              <div
                key={i}
                onClick={() => setCurrentTime(ch.startTime)}
                className="p-3 bg-neutral-50 dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-neutral-900 dark:text-white">{ch.title}</span>
                  <span className="font-mono text-[10px] text-neutral-400">
                    {formatSec(ch.startTime)} - {formatSec(ch.endTime)}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 leading-relaxed">{ch.summary}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Moments & Insights */}
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
            Moments Forts & Citations Notables
          </h2>
          <div className="space-y-3">
            {video.keyMoments.map((km, i) => (
              <div
                key={i}
                onClick={() => setCurrentTime(km.timestamp)}
                className="p-3 bg-neutral-50 dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 cursor-pointer transition-colors flex items-start gap-3"
              >
                <Bookmark className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-neutral-900 dark:text-white">
                    <span>{km.label}</span>
                    <span className="font-mono text-[10px] text-neutral-400 font-normal">
                      @{formatSec(km.timestamp)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-neutral-500 leading-relaxed">{km.insight}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
