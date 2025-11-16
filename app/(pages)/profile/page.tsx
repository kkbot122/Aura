"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Camera, Edit3, Save, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast"; // Assuming you have shadcn toast, optional

export function DashboardProfile({ user }: { user: any }) {
  const supabase = createClient();
  // const { toast } = useToast(); // Optional toast notification
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Stats state
  const [stats, setStats] = useState({ created: 0, archived: 0 });

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    bio: "",
    company: "",
    website: "",
  });

  // Fetch Profile and Stats on Load
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      setLoading(true);

      // 1. Fetch Profile
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setProfile({
          firstName: profileData.first_name || "",
          lastName: profileData.last_name || "",
          email: user.email || "",
          bio: profileData.bio || "",
          company: profileData.company || "",
          website: profileData.website || "",
        });
      }

      // 2. Fetch Stats (Count logos)
      const { count: createdCount } = await supabase
        .from('logos')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      const { count: archivedCount } = await supabase
        .from('logos')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('archived', true);

      setStats({ 
        created: createdCount || 0, 
        archived: archivedCount || 0 
      });
      
      setLoading(false);
    };

    fetchData();
  }, [user, supabase]);

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);

    const updates = {
      id: user.id,
      first_name: profile.firstName,
      last_name: profile.lastName,
      company: profile.company,
      website: profile.website,
      bio: profile.bio,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('profiles').upsert(updates);

    setSaving(false);
    if (!error) {
      setIsEditing(false);
      // toast({ title: "Profile updated successfully" }); 
    } else {
      console.error(error);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-gray-600">Manage your personal information</p>
        </div>
        <Button
          variant={isEditing ? "outline" : "default"}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? (
            <>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </>
          ) : (
            <>
              <Edit3 className="mr-2 h-4 w-4" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile Overview */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="text-lg bg-emerald-100 text-emerald-700">
                    {profile.firstName?.[0]?.toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div>
                <h3 className="text-xl font-semibold">
                  {profile.firstName} {profile.lastName}
                </h3>
                <p className="text-gray-600">{profile.email}</p>
                <Badge variant="secondary" className="mt-2 bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                  Pro Member
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your personal details and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={profile.firstName}
                  onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={profile.lastName}
                  onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                disabled
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={profile.company}
                onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={profile.website}
                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                disabled={!isEditing}
                rows={4}
              />
            </div>
            {isEditing && (
              <Button onClick={handleSave} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700">
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Changes
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Real Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">{stats.created}</div>
              <div className="text-gray-600">Logos Created</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.archived}</div>
              <div className="text-gray-600">Archived Projects</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">100%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}