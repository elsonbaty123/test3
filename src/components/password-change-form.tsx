
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { PasswordInput } from '@/components/password-input';
import { useTranslation } from 'react-i18next';

export function PasswordChangeForm() {
    const { t } = useTranslation();
    const { changePassword } = useAuth();
    const { toast } = useToast();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        setIsSaving(true);
        try {
            await changePassword({ currentPassword, newPassword, confirmPassword });
            toast({
                title: t('password_changed_toast'),
                description: t('password_changed_toast_desc'),
            });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: t('password_change_failed_toast'),
                description: error.message || t('password_change_failed_toast_desc'),
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>{t('change_password')}</CardTitle>
                <CardDescription>
                    {t('change_password_desc')}
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2 text-left rtl:text-right">
                        <Label htmlFor="current-password">{t('current_password_label')}</Label>
                        <PasswordInput 
                            id="current-password" 
                            value={currentPassword} 
                            onChange={(e) => setCurrentPassword(e.target.value)} 
                            required 
                            placeholder={t('current_password_placeholder')}
                        />
                    </div>
                    <div className="space-y-2 text-left rtl:text-right">
                        <Label htmlFor="new-password">{t('new_password_label')}</Label>
                        <PasswordInput 
                            id="new-password" 
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)} 
                            required 
                            showStrength 
                            placeholder={t('password_placeholder')}
                        />
                    </div>
                    <div className="space-y-2 text-left rtl:text-right">
                        <Label htmlFor="confirm-password">{t('confirm_new_password_label')}</Label>
                        <PasswordInput 
                            id="confirm-password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            required 
                            placeholder={t('password_placeholder')}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isSaving}>
                        {isSaving && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
                        {t('update_password')}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
