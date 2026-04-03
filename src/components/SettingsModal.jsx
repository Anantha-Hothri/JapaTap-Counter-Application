import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Upload, Volume2, Check, Music, Image, Vibrate, BarChart3, Trash2, BatteryLow } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { base44 } from '@/api/base44Client';

export default function SettingsModal({
  isOpen, onClose,
  targetNumber, setTargetNumber,
  selectedRingtone, setSelectedRingtone,
  customRingtoneUrl, setCustomRingtoneUrl,
  presetRingtones,
  selectedBackground, setSelectedBackground,
  customBackgroundUrl, setCustomBackgroundUrl,
  presetBackgrounds,
  enableBellSound, setEnableBellSound,
  enableVibration, setEnableVibration,
  totalTaps, sessionsCompleted,
  onClearStats,
  onEnableBatterySaver,
  roundsMode, setRoundsMode,
  roundSize, setRoundSize,
}) {
  const [localTarget, setLocalTarget] = useState(targetNumber || '');
  const [uploading, setUploading] = useState(false);
  const [customFileName, setCustomFileName] = useState('');
  const [uploadingBg, setUploadingBg] = useState(false);
  const [customBgFileName, setCustomBgFileName] = useState('');
  const audioPreviewRef = useRef(null);
  const fileInputRef = useRef(null);
  const bgFileInputRef = useRef(null);

  const ringtoneOptions = [
    { id: 'bell1',   name: 'Bell 1',        icon: '🔔' },
    { id: 'bell2',   name: 'Bell 2',        icon: '🛎️' },
    { id: 'chime',   name: 'Chime',         icon: '🎵' },
    { id: 'gong',    name: 'Gong',          icon: '🥁' },
    { id: 'crystal', name: 'Crystal Bowl',  icon: '🎶' },
    { id: 'tibetan', name: 'Tibetan Bell',  icon: '🪘' },
  ];

  const backgroundOptions = [
    { id: 'gradient1', name: 'Golden',   preview: 'linear-gradient(135deg, #fef3c7 0%, #f59e0b 50%, #92400e 100%)' },
    { id: 'gradient2', name: 'Ocean',    preview: 'linear-gradient(135deg, #dbeafe 0%, #3b82f6 50%, #1e3a8a 100%)' },
    { id: 'gradient3', name: 'Rose',     preview: 'linear-gradient(135deg, #fce7f3 0%, #ec4899 50%, #831843 100%)' },
    { id: 'gradient4', name: 'Forest',   preview: 'linear-gradient(135deg, #d1fae5 0%, #10b981 50%, #065f46 100%)' },
    { id: 'gradient5', name: 'Midnight', preview: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #0f172a 100%)' },
    { id: 'gradient6', name: 'Aurora',   preview: 'linear-gradient(135deg, #064e3b 0%, #065f46 30%, #7c3aed 70%, #1e1b4b 100%)' },
  ];

  const handleSave = () => {
    const num = parseInt(localTarget);
    setTargetNumber(num > 0 ? num : null);
    onClose();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/x-wav'];
    if (!validTypes.includes(file.type)) { alert('Please upload an MP3 or WAV file'); return; }
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setCustomRingtoneUrl(file_url);
    setCustomFileName(file.name);
    setSelectedRingtone('custom');
    setUploading(false);
  };

  const playPreview = (ringtoneId) => {
    const url = ringtoneId === 'custom' ? customRingtoneUrl : presetRingtones[ringtoneId];
    if (url && audioPreviewRef.current) {
      audioPreviewRef.current.src = url;
      audioPreviewRef.current.play().catch(() => {});
    }
  };

  const selectRingtone = (id) => {
    setSelectedRingtone(id);
    if (id !== 'custom') { setCustomRingtoneUrl(null); setCustomFileName(''); }
  };

  const handleBgFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) { alert('Please upload a JPG, PNG, or WEBP image'); return; }
    setUploadingBg(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setCustomBackgroundUrl(file_url);
    setCustomBgFileName(file.name);
    setSelectedBackground('custom');
    setUploadingBg(false);
  };

  const selectBackground = (id) => {
    setSelectedBackground(id);
    if (id !== 'custom') { setCustomBackgroundUrl(null); setCustomBgFileName(''); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />

          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-b from-amber-50 to-white rounded-t-3xl max-h-[85vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-amber-300" />
            </div>

            <div className="flex items-center justify-between px-6 pb-4 border-b border-amber-100">
              <h2 className="text-xl font-bold text-amber-900">Settings</h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-amber-100 transition-colors">
                <X className="w-5 h-5 text-amber-700" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Bell Notification */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-600" />
                  <Label className="text-base font-semibold text-amber-900">Bell Notification</Label>
                </div>
                <p className="text-sm text-amber-600">Ring a bell when you reach this count</p>
                <Input
                  type="number" placeholder="e.g., 108" value={localTarget}
                  onChange={(e) => setLocalTarget(e.target.value)}
                  className="bg-white border-amber-200 focus:border-amber-400 text-lg"
                />
                <div className="flex gap-2 flex-wrap">
                  {[27, 54, 108, 216, 1008].map((num) => (
                    <button
                      key={num} onClick={() => setLocalTarget(num.toString())}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${localTarget === num.toString() ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-amber-100">
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-5 h-5 text-amber-600" />
                    <Label className="text-base font-medium text-amber-900">Enable bell sound</Label>
                  </div>
                  <Switch checked={enableBellSound} onCheckedChange={setEnableBellSound} />
                </div>
                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-amber-100">
                  <div className="flex items-center gap-3">
                    <Vibrate className="w-5 h-5 text-amber-600" />
                    <Label className="text-base font-medium text-amber-900">Enable vibration</Label>
                  </div>
                  <Switch checked={enableVibration} onCheckedChange={setEnableVibration} />
                </div>
              </div>

              {/* Ringtone Selection */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-amber-600" />
                  <Label className="text-base font-semibold text-amber-900">Notification Sound</Label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {ringtoneOptions.map((ringtone) => (
                    <button
                      key={ringtone.id}
                      onClick={() => selectRingtone(ringtone.id)}
                      className={`relative p-4 rounded-xl border-2 transition-all ${selectedRingtone === ringtone.id ? 'border-amber-500 bg-amber-50' : 'border-amber-100 bg-white hover:border-amber-200'}`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-2xl">{ringtone.icon}</span>
                        <span className="text-sm font-medium text-amber-800">{ringtone.name}</span>
                      </div>
                      {selectedRingtone === ringtone.id && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); playPreview(ringtone.id); }}
                        className="absolute bottom-2 right-2 p-1.5 rounded-full bg-amber-100 hover:bg-amber-200 transition-colors"
                      >
                        <Volume2 className="w-3 h-3 text-amber-600" />
                      </button>
                    </button>
                  ))}
                </div>

                {/* Custom Upload */}
                <input ref={fileInputRef} type="file" accept=".mp3,.wav,audio/mpeg,audio/wav" onChange={handleFileUpload} className="hidden" />
                <button
                  onClick={() => fileInputRef.current?.click()} disabled={uploading}
                  className={`w-full p-4 rounded-xl border-2 border-dashed transition-all ${selectedRingtone === 'custom' ? 'border-amber-500 bg-amber-50' : 'border-amber-200 hover:border-amber-300 bg-white'}`}
                >
                  <div className="flex flex-col items-center gap-2">
                    {uploading ? <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /> : <Upload className="w-6 h-6 text-amber-500" />}
                    <span className="text-sm font-medium text-amber-700">{uploading ? 'Uploading...' : customFileName || 'Upload Custom Sound'}</span>
                    <span className="text-xs text-amber-500">MP3 or WAV files</span>
                  </div>
                </button>
                {customRingtoneUrl && (
                  <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Music className="w-4 h-4 text-amber-600" />
                      <span className="text-sm text-amber-700 truncate max-w-[200px]">{customFileName || 'Custom sound'}</span>
                    </div>
                    <button onClick={() => playPreview('custom')} className="p-1.5 rounded-full bg-amber-200 hover:bg-amber-300 transition-colors">
                      <Volume2 className="w-4 h-4 text-amber-700" />
                    </button>
                  </div>
                )}
              </div>

              {/* Background Selection */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Image className="w-5 h-5 text-amber-600" />
                  <Label className="text-base font-semibold text-amber-900">Background Theme</Label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {backgroundOptions.map((bg) => (
                    <button
                      key={bg.id} onClick={() => selectBackground(bg.id)}
                      className={`relative h-24 rounded-xl border-2 transition-all overflow-hidden ${selectedBackground === bg.id ? 'border-amber-500 ring-2 ring-amber-200' : 'border-amber-100 hover:border-amber-200'}`}
                      style={{ background: bg.preview }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2">
                        <span className="text-xs font-medium text-white drop-shadow">{bg.name}</span>
                      </div>
                      {selectedBackground === bg.id && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Custom Background Upload */}
                <input ref={bgFileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleBgFileUpload} className="hidden" />
                <button
                  onClick={() => bgFileInputRef.current?.click()} disabled={uploadingBg}
                  className={`w-full p-4 rounded-xl border-2 border-dashed transition-all ${selectedBackground === 'custom' ? 'border-amber-500 bg-amber-50' : 'border-amber-200 hover:border-amber-300 bg-white'}`}
                >
                  <div className="flex flex-col items-center gap-2">
                    {uploadingBg ? <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /> : <Upload className="w-6 h-6 text-amber-500" />}
                    <span className="text-sm font-medium text-amber-700">{uploadingBg ? 'Uploading...' : customBgFileName || 'Upload Custom Background'}</span>
                    <span className="text-xs text-amber-500">JPG, PNG or WEBP files</span>
                  </div>
                </button>
                {customBackgroundUrl && (
                  <div className="flex items-center p-3 bg-amber-50 rounded-lg gap-2">
                    <Image className="w-4 h-4 text-amber-600" />
                    <span className="text-sm text-amber-700 truncate">{customBgFileName || 'Custom background'}</span>
                  </div>
                )}
              </div>

              {/* Rounds Mode */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-600" />
                  <Label className="text-base font-semibold text-amber-900">Rounds Mode</Label>
                </div>
                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-amber-100">
                  <div>
                    <div className="text-sm font-medium text-amber-900">Enable Rounds Mode</div>
                    <div className="text-xs text-amber-500 mt-0.5">Bell rings at every multiple of {roundSize}, rounds increment accordingly</div>
                  </div>
                  <Switch checked={roundsMode} onCheckedChange={setRoundsMode} />
                </div>
                {roundsMode && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-amber-700">Taps per round</Label>
                    <div className="flex gap-2 flex-wrap">
                      {[27, 54, 108, 216].map(n => (
                        <button key={n} onClick={() => setRoundSize(n)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${roundSize === n ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}>
                          {n}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-amber-500">Bell will ring at {roundSize}, {roundSize * 2}, {roundSize * 3}… marking each completed round.</p>
                  </div>
                )}
              </div>

              {/* Battery Saver Mode */}
              <div className="space-y-3">
                <button
                  onClick={() => { onClose(); onEnableBatterySaver?.(); }}
                  className="w-full flex items-center justify-between p-4 bg-gray-900 rounded-xl border border-gray-700 text-white hover:bg-gray-800 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <BatteryLow className="w-5 h-5 text-green-400" />
                    <div className="text-left">
                      <div className="font-semibold text-sm">Battery Saver Mode</div>
                      <div className="text-xs text-gray-400">Black screen — tap to count</div>
                    </div>
                  </div>
                  <span className="text-gray-400 text-lg">›</span>
                </button>
              </div>

              {/* Statistics */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-amber-600" />
                  <Label className="text-base font-semibold text-amber-900">Statistics</Label>
                </div>
                <div className="bg-white rounded-xl border border-amber-100 p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-amber-700">Total taps (all time):</span>
                    <span className="text-2xl font-bold text-amber-900">{totalTaps.toLocaleString()}</span>
                  </div>
                  <div className="h-px bg-amber-100" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-amber-700">Sessions completed:</span>
                    <span className="text-2xl font-bold text-amber-900">{sessionsCompleted}</span>
                  </div>
                  <Button onClick={onClearStats} variant="outline" className="w-full mt-4 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear Statistics
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-amber-100 bg-white flex-shrink-0">
              <Button onClick={handleSave} className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/25">
                Save Settings
              </Button>
            </div>

            <audio ref={audioPreviewRef} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}