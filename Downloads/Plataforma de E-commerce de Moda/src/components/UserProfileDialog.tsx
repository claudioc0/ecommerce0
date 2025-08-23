import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserUpdate } from '../types/user';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { toast } from 'sonner@2.0.3';
import { Loader2, User, Mail, Phone, Calendar, MapPin, Settings, Trash2, LogOut, Save } from 'lucide-react';

interface UserProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserProfileDialog({ isOpen, onClose }: UserProfileDialogProps) {
  const { user, updateProfile, deleteAccount, isLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<UserUpdate>({
    name: '',
    phone: '',
    dateOfBirth: '',
    gender: undefined,
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Brasil'
    },
    preferences: {
      newsletter: false,
      promotions: false
    }
  });

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || undefined,
        address: user.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'Brasil'
        },
        preferences: user.preferences || {
          newsletter: false,
          promotions: false
        }
      });
    }
  }, [user]);

  // Reset tab when dialog opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab('profile');
    }
  }, [isOpen]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name?.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }

    setIsSaving(true);
    const result = await updateProfile(formData);
    setIsSaving(false);
    
    if (result.success) {
      toast.success('Perfil atualizado com sucesso!');
    } else {
      toast.error(result.error || 'Erro ao atualizar perfil');
    }
  };

  const handleDeleteAccount = async () => {
    const result = await deleteAccount();
    
    if (result.success) {
      toast.success('Conta excluída com sucesso');
      onClose();
    } else {
      toast.error(result.error || 'Erro ao excluir conta');
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
    toast.success('Logout realizado com sucesso');
  };

  const handleCloseDialog = () => {
    setActiveTab('profile');
    onClose();
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Meu Perfil
          </DialogTitle>
          <DialogDescription>
            Gerencie suas informações pessoais e preferências da conta.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="address">Endereço</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <form onSubmit={handleUpdateProfile}>
            <TabsContent value="profile" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      className="pl-10"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={isLoading || isSaving}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      className="pl-10 bg-muted"
                      value={user.email}
                      disabled
                      title="Email não pode ser alterado"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    O email não pode ser alterado
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      className="pl-10"
                      placeholder="(11) 99999-9999"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={isLoading || isSaving}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Data de Nascimento</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="dateOfBirth"
                      type="date"
                      className="pl-10"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      disabled={isLoading || isSaving}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gênero</Label>
                <Select 
                  value={formData.gender || ''} 
                  onValueChange={(value) => setFormData({ ...formData, gender: value as 'male' | 'female' | 'other' })}
                  disabled={isLoading || isSaving}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione seu gênero" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Masculino</SelectItem>
                    <SelectItem value="female">Feminino</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="address" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="street">Rua/Endereço</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="street"
                    type="text"
                    className="pl-10"
                    placeholder="Rua das Flores, 123"
                    value={formData.address?.street || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      address: { ...formData.address!, street: e.target.value }
                    })}
                    disabled={isLoading || isSaving}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="São Paulo"
                    value={formData.address?.city || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      address: { ...formData.address!, city: e.target.value }
                    })}
                    disabled={isLoading || isSaving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    id="state"
                    type="text"
                    placeholder="SP"
                    maxLength={2}
                    value={formData.address?.state || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      address: { ...formData.address!, state: e.target.value.toUpperCase() }
                    })}
                    disabled={isLoading || isSaving}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zipCode">CEP</Label>
                  <Input
                    id="zipCode"
                    type="text"
                    placeholder="12345-678"
                    value={formData.address?.zipCode || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      address: { ...formData.address!, zipCode: e.target.value }
                    })}
                    disabled={isLoading || isSaving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">País</Label>
                  <Input
                    id="country"
                    type="text"
                    value={formData.address?.country || 'Brasil'}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      address: { ...formData.address!, country: e.target.value }
                    })}
                    disabled={isLoading || isSaving}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <h4>Preferências de Comunicação</h4>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label>Newsletter</Label>
                      <p className="text-sm text-muted-foreground">
                        Receber novidades e promoções por email
                      </p>
                    </div>
                    <Switch
                      checked={formData.preferences?.newsletter || false}
                      onCheckedChange={(checked) => setFormData({
                        ...formData,
                        preferences: { ...formData.preferences!, newsletter: checked }
                      })}
                      disabled={isLoading || isSaving}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label>Promoções SMS</Label>
                      <p className="text-sm text-muted-foreground">
                        Receber ofertas especiais por SMS
                      </p>
                    </div>
                    <Switch
                      checked={formData.preferences?.promotions || false}
                      onCheckedChange={(checked) => setFormData({
                        ...formData,
                        preferences: { ...formData.preferences!, promotions: checked }
                      })}
                      disabled={isLoading || isSaving}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Trash2 className="h-4 w-4 text-destructive" />
                  <h4 className="text-destructive">Zona de Perigo</h4>
                </div>
                
                <div className="space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleLogout}
                    className="w-full justify-start"
                    disabled={isLoading || isSaving}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair da Conta
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        className="w-full justify-start"
                        disabled={isLoading || isSaving}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir Conta Permanentemente
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                          <Trash2 className="h-5 w-5" />
                          Tem certeza absoluta?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação é <strong>irreversível</strong>. Todos os seus dados serão excluídos permanentemente:
                          <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Informações do perfil</li>
                            <li>Histórico de compras</li>
                            <li>Endereços salvos</li>
                            <li>Preferências</li>
                          </ul>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleDeleteAccount} 
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Excluindo...
                            </>
                          ) : (
                            <>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Sim, excluir permanentemente
                            </>
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </TabsContent>

            <div className="flex justify-between items-center pt-6 border-t">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading || isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}